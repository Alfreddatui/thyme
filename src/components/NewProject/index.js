// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';

import { valueFromEventTarget } from '../../core/dom';

import { addProject } from '../../actions/projects';

import ProjectInput from '../ProjectInput';
import Button from '../Button';

import './NewProject.css';

function defaultState() {
  return {
    name: '',
    parent: null,
  };
}

type NewProjectStateType = {
  name: string,
  parent: string | null,
};

type NewProjectType = {
  onAddProject: (project: NewProjectStateType) => void,
};

class NewProject extends Component<NewProjectType, NewProjectStateType> {
  constructor(props) {
    super(props);

    this.onNameChange = e => this.onValueChange('name', valueFromEventTarget(e.target));
    this.onProjectChange =
        project => this.onValueChange('parent', project === null ? null : project.value);
    this.onSubmit = this.addNew.bind(this);

    this.state = defaultState();
  }

  onNameChange: (e: Event) => void;
  onProjectChange: (project: { value: string, label: string }) => void;
  onSubmit: () => void;

  onValueChange(key: string, value: string | null) {
    this.setState({
      [key]: value,
    });
  }

  addNew() {
    const { onAddProject } = this.props;

    if (this.state.name.trim() === '') {
      return;
    }

    onAddProject({
      ...this.state,
    });

    this.setState(defaultState());
  }

  render() {
    const { name, parent } = this.state;

    return (
      <div className="NewProject">
        <input
          id="project-name"
          name="project-name"
          className="NewProject__input"
          type="text"
          placeholder="Project name"
          value={name}
          onChange={this.onNameChange}
        />
        <ProjectInput handleChange={this.onProjectChange} value={parent} />
        <Button value="Add project" onClick={this.onSubmit} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onAddProject(project) {
      dispatch(addProject({
        ...project,
        id: shortid.generate(),
      }));
    },
  };
}

export default connect(null, mapDispatchToProps)(NewProject);