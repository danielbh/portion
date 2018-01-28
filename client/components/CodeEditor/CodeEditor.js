import React, { Component } from 'react'
import './style.css'
import '../../../node_modules/codemirror/lib/codemirror.css'

const CodeMirror = require('react-codemirror')

require('codemirror/mode/javascript/javascript')

class codeEditor extends Component {
  constructor() {
    super();
    this.state = { code: '' }
  }
  getInitialState() {
		this.setState({ code: '// Code' })
	}
  updateCode(newCode) {
	  this.setState({
		  code: newCode,
	  })
  }
  render() {
    const options = { lineNumbers: true, mode: 'javascript' }
    return <CodeMirror value={this.state.code} onChange={this.updateCode} options={options} />
  }
}

export default codeEditor
