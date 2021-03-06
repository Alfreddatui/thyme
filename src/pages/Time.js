// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';
import Divider from 'semantic-ui-react/dist/commonjs/elements/Divider';
import Accordion from 'semantic-ui-react/dist/commonjs/modules/Accordion/Accordion';
import Responsive from 'semantic-ui-react/dist/commonjs/addons/Responsive/Responsive';
import Pagination from 'semantic-ui-react/dist/commonjs/addons/Pagination/Pagination';

import DateRange from '../components/DateRange';
import DateSort from '../components/DateSort';
import ThymeTable from '../components/ThymeTable';

import { changePage } from '../actions/time';

import { getCurrentTimeEntries, getPage } from '../selectors/time';

import './Time.css';

type TimeProps = {
  entries: Array<timeType>;
  now?: Date;
  page: number;
  changeEntriesPage: (page: number) => void;
};

type TimeState = {
  filterOpen: boolean;
}

class Time extends Component<TimeProps, TimeState> {
  state = {
    filterOpen: false,
  };

  entriesPerPage = 10;

  handleToggle = () => {
    const { filterOpen } = this.state;

    this.setState({ filterOpen: !filterOpen });
  };

  handlePaginationChange = (e: Event, { activePage }: { activePage: number }) => {
    const { changeEntriesPage } = this.props;

    changeEntriesPage(activePage);
  };

  render() {
    const { entries, now = new Date(), page } = this.props;
    const { filterOpen } = this.state;

    const totalPages = Math.ceil(entries.length / this.entriesPerPage);
    const start = (page - 1) * this.entriesPerPage;
    const end = (page * this.entriesPerPage) - 1;

    return (
      <div className="Time">
        <Responsive as={Fragment} maxWidth={Responsive.onlyTablet.minWidth}>
          <Accordion fluid>
            <Accordion.Title
              active={filterOpen}
              onClick={this.handleToggle}
              content="Filters / sorting"
            />
            <Accordion.Content active={filterOpen}>
              <Header as="h5">Date range:</Header>
              <DateRange vertical />
              <Header as="h5">Sort by:</Header>
              <DateSort />
            </Accordion.Content>
          </Accordion>
          <Divider />
        </Responsive>
        <Responsive as={Fragment} minWidth={Responsive.onlyTablet.minWidth}>
          <div className="Time__RangeSort">
            <DateRange />
            <DateSort />
          </div>
        </Responsive>
        <ThymeTable
          entries={entries.filter((item, index) => index <= end && index >= start)}
          now={now}
        />
        {totalPages > 1 && (
          <Pagination
            firstItem={null}
            lastItem={null}
            activePage={page}
            totalPages={totalPages}
            siblingRange={2}
            onPageChange={this.handlePaginationChange}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state, props: TimeProps) {
  const { now } = props;

  return {
    entries: getCurrentTimeEntries(now || new Date())(state),
    page: getPage(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeEntriesPage(page: number) {
      dispatch(changePage(page));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Time);
