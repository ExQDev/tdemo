import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';

import { 
  simpleAction, 
  nextPage, 
  prevPage, 
  sortBy, 
  singin, 
  postNew, 
  showToast, 
  hideToast 
} from './actions/simpleAction';

import { 
  Button, 
  Page, 
  Col, 
  Row, 
  List, 
  ListHeader, 
  ListTitle, 
  Checkbox, 
  Modal, 
  Input, 
  ListItem,
  Toast
} from 'react-onsenui';

import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

const symbolUp = '▲'
const symbolDown = '▼'

/* 
 * mapDispatchToProps
*/
const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction()),
  nextPage: () => dispatch(nextPage()),
  prevPage: () => dispatch(prevPage()),
  sortBy: (column, mode) => dispatch(sortBy(column, mode)),
  singin: (payload) => dispatch(singin(payload)),
  postNew: (payload) => dispatch(postNew(payload)),
  showToast: (text) => dispatch(showToast(text)),
  hideToast: () => dispatch(hideToast())
})

/* 
 * mapStateToProps
*/
const mapStateToProps = state => ({
  ...state
})

/**
 * @class App
 * @extends {Component}
 */
class App extends Component {

  state = {
    isLoggingIn: false,
    username: '',
    password: '',
    email: '',
    taskText: '',
    isCreatingNew: false
  }

  componentDidMount () {
    this.simpleAction()
  }

  simpleAction = (event) => {
    this.props.simpleAction();
  }

  nextPage = () => {
    this.props.nextPage();
  }

  prevPage = () => {
    this.props.prevPage();
  }

  sortBy = (column) => {
    const mode = this.props.simpleReducer.mode === 'asc' ? 'desc' : 'asc'
    this.props.sortBy(column, mode)
  }

  getSortSign = (thisColumn) => {
    const { mode, column } = this.props.simpleReducer
    if(thisColumn !== column)
      return null
    
    if(mode === 'asc')
      return symbolUp
    else
      return symbolDown
  }

  cropText = (text) => {
    return text.length > 30 ? `${text.slice(0, 30)}...` : text
  }

  createNew = () => {
    const { isCreatingNew } = this.state
    this.setState({
      isCreatingNew: !isCreatingNew
    })
  }

  auth = () => {
    const { isLoggingIn } = this.state
    this.setState({
      isLoggingIn: !isLoggingIn
    })
  }

  signIn = () => {
    const { username, password } = this.state
    this.props.singin({username, password})
  }

  postNew = () => {
    const { username, email, taskText } = this.state
    this.props.postNew({username, email, text: taskText})
  }

  hideToast = () => {
    setTimeout(() => this.props.hideToast(), 2500)
  }

  mapRows = () => {
    const { tasks, loggedIn } = this.props.simpleReducer
    
    if(tasks)
      return tasks.map(task => (<Row key={task.id}>
        <Col> {this.cropText(task.username)}</Col>
        <Col>{this.cropText(task.email)}</Col>
        <Col>{this.cropText(task.text)}</Col>
        <Col> <Checkbox checked={task.status === 10} disabled={!loggedIn}></Checkbox></Col>
      </Row>))
    return null
  }
  

  render() {
    const { pageNum, toastText, isToastShown } = this.props.simpleReducer
    const { isLoggingIn, username, password, email, taskText, isCreatingNew } = this.state
    return (
      <div className="App">
        <Page>
          <List>
            <ListTitle>Page {pageNum}</ListTitle>
            <ListHeader>
              <Row>
                <Col onClick={() => this.sortBy('username')}>{this.getSortSign('username')} Username</Col>
                <Col onClick={() => this.sortBy('email')}>{this.getSortSign('email')} Email</Col>
                <Col>Task Text</Col>
                <Col onClick={() => this.sortBy('status')}>{this.getSortSign('status')} Status</Col>
              </Row>
            </ListHeader>
            {this.mapRows()}
          </List>
          <Button onClick={this.prevPage}>Prev</Button>
          <Button onClick={this.createNew}>New</Button>
          <Button onClick={this.auth}>Log In</Button>
          <Button onClick={this.nextPage}>Next</Button>
          <Modal isOpen={isCreatingNew}>
            <List style={{width: 320, margin: 'auto'}}>
              <ListItem>
                <Input
                   style={{ width: '100%' }}
                  value={username} 
                  float
                  onChange={(event) => { this.setState({username: event.target.value})} }
                  modifier='material'
                  placeholder='Username' />
              </ListItem>
              <ListItem>
                <Input
                   style={{ width: '100%' }}
                  value={email} 
                  float
                  onChange={(event) => { this.setState({email: event.target.value})} }
                  modifier='material'
                  placeholder='email' />
              </ListItem>
              <ListItem>
                <Input
                   style={{ width: '100%' }}
                  value={taskText} 
                  float
                  onChange={(event) => { this.setState({taskText: event.target.value})} }
                  modifier='material'
                  placeholder='Text' />
              </ListItem>
              <ListItem>
                <Button style={{ width: '100%' }} onClick={this.postNew}>Save</Button>
              </ListItem>
              <ListItem>
                <Button style={{ width: '100%' }} onClick={this.createNew}>Close</Button>
              </ListItem>
            </List>
          </Modal>
          <Modal isOpen={isLoggingIn} style={{ zIndex: '333 !important' }}>
            <List style={{width: 320, margin: 'auto'}}>
              <ListItem>
                <Input
                   style={{ width: '100%' }}
                  value={username} 
                  float
                  onChange={(event) => { this.setState({username: event.target.value})} }
                  modifier='material'
                  placeholder='Username' />
              </ListItem>
              <ListItem>
                <Input
                  style={{ width: '100%' }}
                  value={password} 
                  float
                  type='password'
                  onChange={(event) => { this.setState({password: event.target.value})} }
                  modifier='material'
                  placeholder='Password' />
              </ListItem>
              <ListItem>
                <Button style={{ width: '100%' }} onClick={this.signIn}>Sign In</Button>
              </ListItem>
              <ListItem>
                <Button style={{ width: '100%' }} onClick={this.auth}>Close</Button>
              </ListItem>
            </List>
          </Modal>
          <Toast 
            isOpen={isToastShown} 
            animation="ascend" 
            onPostShow={this.hideToast} 
            modifier="error"
            animationOptions={{
              duration: 0.2,
              delay: 0.4,
              timing: 'ease-in'
            }}> {toastText}</Toast>
        </Page>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
