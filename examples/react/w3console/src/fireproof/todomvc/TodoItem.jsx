import React, { Component, createRef } from 'react'

const ESCAPE_KEY = 27
const ENTER_KEY = 13

class TodoItem extends Component {
  state = { editText: this.props.todo.title }
  EditFieldRef = createRef()
  handleSubmit = event => {
    const val = this.state.editText.trim()
    if (val) {
      this.props.onSave(val)
      this.setState({ editText: val })
    } else {
      this.props.onDestroy()
    }
  }

  handleEdit = () => {
    this.props.onEdit()
    this.setState({ editText: this.props.todo.title })
  }

  handleKeyDown = event => {
    if (event.which === ESCAPE_KEY) {
      this.setState({ editText: this.props.todo.title })
      this.props.onCancel(event)
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event)
    }
  }

  handleChange = event => {
    if (this.props.editing) {
      this.setState({ editText: event.target.value })
    }
  }

  /**
   * This is a completely optional performance enhancement that you can
   * implement on any React component. If you were to delete this method
   * the app would still work correctly (and still be very performant!), we
   * just use it as an example of how little code it takes to get an order
   * of magnitude performance improvement.
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    )
  }

  /**
   * Safely manipulate the DOM after updating the state when invoking
   * `this.props.onEdit()` in the `handleEdit` method above.
   * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
   * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
   */
  componentDidUpdate(prevProps) {
    if (!prevProps.editing && this.props.editing) {
      const node = this.EditFieldRef.current
      node.focus()
      node.setSelectionRange(node.value.length, node.value.length)
    }
  }

  render() {
    return (
      <li
        className={`p-2 hover:bg-gray-200 rounded ${
          this.props.todo.completed && 'completed'} ${
          this.props.editing && 'editing'
        }`}
      >
        <div>
          <input
            class="m-2"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          {this.props.editing && (
          <input
            ref={this.EditFieldRef}
            class="bg-slate-100 rounded w-3/4"
            value={this.state.editText}
            onBlur={this.handleSubmit}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
        )}
          {!this.props.editing && <label onDoubleClick={this.handleEdit}>{this.props.todo.title}</label>}
          <button class="float-right" onClick={this.props.onDestroy} >x</button>
        </div>
      </li>
    )
  }
}
export default TodoItem
