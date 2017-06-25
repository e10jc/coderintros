// @flow

import React, {Component} from 'react'
import localForage from 'localforage'
import {create} from 'mobx-persist'
import {observer, PropTypes as MobxReactPropTypes} from 'mobx-react'

import createPage from '../helpers/create-page'
import Post from '../components/post'
import PostStore from '../stores/post'

@observer
class Interview extends Component {
  static childContextTypes = {
    postStore: MobxReactPropTypes.observableObject
  }

  static displayName = 'Interview'

  getChildContext = () => ({
    postStore: this.postStore
  })

  componentWillMount () {
    this.postStore = new PostStore({
      questionsData: this.props.questionsData
    })
  }

  componentDidMount () {
    create({store: localForage})('NewInterview', this.postStore)
  }

  props: {
    questionsData: Object
  }
  postStore: Object

  render = () => <Post />
}

export default createPage(Interview, {
  hrTop: false,
  propPaths: () => ({
    questionsData: '/ci/questions'
  })
})
