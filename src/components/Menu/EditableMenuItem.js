import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import IconDisplay from './IconDisplay';
import {observer} from "mobx-react";
import keydown, { Keys } from 'react-keydown';

/*
  Editable component encapsulates the menu item where clicking on it 
  truncates the menu
*/

const editIcon  = 'fa-edit';
const trashIcon = 'fa-trash';

const Noop = styled.span`
  margin: 0px
  padding: 0px
`;

const EditForm = styled.form`

`;

const StyledInput = styled.input`

`;

const StyledDeletable = styled.div`

`;

//pulled from MenuItem
const StyledEditableLabel = styled.div`
  cursor: ${props => props.cursor};
  width: ${props => props.width};
  /*max-width: ${props => props.width};*/
  display: table-cell;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  margin: 1em;
`;




const EditItem = observer(class EditItem extends Component {
  componentDidMount() {
    //this.focusInput.focus();

  }
  updateValue(ev) {
    ev.preventDefault();
    this.props.store.updateLabel(ev.target.value);
  }
  commitChanges(ev) {
    ev.preventDefault()
    this.props.store.commitEditing();
  }
  exitEditState() {
    this.props.store.clearEditing();
  }
  render() {
    return (
      <form onSubmit={this.commitChanges.bind(this)}>
        <StyledInput
          type="text"
          autoFocus
          onBlur={this.updateValue.bind(this)}
          onChange={this.updateValue.bind(this)}
          defaultValue={this.props.store.editing.label}>
        </StyledInput>
      </form>
    )
  }
})


const DisplayItem = (props) => {
  return (
    <StyledEditableLabel
      color={props.color}
      cursor={props.cursor}
      backgroundColor={props.backgroundColor}
      width={props.width}>
      {props.label}
    </StyledEditableLabel>
  );
};

const HoveringItem = (props) => {
  const setEditMode = (ev) => {
    ev.preventDefault();
    props.store.setEditing(props.id);
  };
  const setDeleteMode = (ev) => {
    ev.preventDefault();
    props.store.setTrashBin(ev.target.value);
  };

  return (
    <StyledEditableLabel
      color={props.color}
      cursor={props.cursor}
      backgroundColor={props.backgroundColor}
      width={props.width}>
      { truncate(props.truncateBy, props.label) }
      <a href="#" onClick={setEditMode}><IconDisplay iconType={editIcon} /></a>
      <a href=""  onClick={setDeleteMode}><IconDisplay iconType={trashIcon} /></a>
    </StyledEditableLabel>
  );
};

const DeletableItem = (props) => {

  const commitDeletion = (ev) => {
    ev.preventDefault();
    props.store.destroyItem(props.store.trashbin);
  };

  const abortDeletion = (ev) => {
    ev.preventDefault();
    props.store.trashbin = null;
  };

  return (
    <div>
      <StyledDeletable
        color={props.color}
        cursor={props.cursor}
        backgroundColor={props.backgroundColor}
        width={props.width}
      >
        <IconDisplay iconType={trashIcon} />
        Are You Sure? 
        <a href=""  onClick={commitDeletion}>Yes</a>
        <a href=""  onClick={abortDeletion}>No</a>
      </StyledDeletable>
    </div>
  );
};

const EditableMenuItem = observer(class EditableMenuItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      label: props.label,
      mode: 'display', // ['display', edit']
      hovering: false
    }
  }
  updateLabel (newLabel) {
    this.setState('label', newLabel);
  }
  propegateUpdate () {
    this.props.update({
      id: this.props.id,
      label: this.state.label
    });
  }
  renderHovering() {
    const props = this.props;
    
  }
  enterHover() {
    //this.props.store.hovering = this.props.id;
    this.props.store.setHovering(this.props.id);
  }
  exitHover() {

  }
  isSelectedState() {
    return this.props.store.selected === this.props.id;
  }
  isHoverState() {
    return this.props.store.hovering === this.props.id;
  }
  isEditState() {
    return this.props.store.editing.id === this.props.id;
  }
  render () {
    const props = this.props;
    return (
      <span
        onMouseEnter={this.enterHover.bind(this)}
      >
        {`sel: ${this.isSelectedState()}`}
        {(this.isEditState()) ? (<EditItem {...props} />) : (
          (this.isHoverState())
          ? (<HoveringItem {...props} />)
          : (<DisplayItem {...props} />)
        )}
      </span>
    );
  }
})


//truncates the string when it is too long
function truncate(by, str) {
  if (str.length <= by) {
    return str;
  } else {
    return str.slice(0, by) + '...'
  }
}

EditableMenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  truncateBy: PropTypes.number, //how many are allowed before cutting it off and adding ...
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  width: PropTypes.string,  //TODO: handle edge case of 0
  cursor: PropTypes.string.isRequired,
  id: PropTypes.node.isRequired
};

EditableMenuItem.defaultProps = {
  truncateBy: 10,
  color: 'black',
  backgroundColor: 'white',
  width: '100px'
}

export default EditableMenuItem;