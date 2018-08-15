// @flow

import React from 'react';
import { connect } from 'react-redux';

import DateRange from '../components/DateRange';
import ThymeTable from '../components/ThymeTable';

import { getCurrentTimeEntries } from '../selectors/time';

type TimeType = {
  entries: Array<timeType>,
  now?: Date, // eslint-disable-line react/no-unused-prop-types
};

function Time({ entries }: TimeType) {
  return (
    <div style={{ paddingLeft: '1%', paddingRight: '1%' }}>
      <DateRange />
      <ThymeTable entries={entries} />
    </div>
  );
}

function mapStateToProps(state, props: TimeType) {
  const { now } = props;

  return { entries: getCurrentTimeEntries(now || new Date())(state) };
}

export default connect(mapStateToProps)(Time);
