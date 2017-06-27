// @flow

import {action, computed, observable} from 'mobx'

export default class HeaderStore {
  @observable scrollHeaderIsEnabled = false
  @observable scrollHeaderIsVisible = false
  @observable scrollTitle = ''
  @observable progress = 0

  @action disableScrollHeader = () => {
    this.scrollHeaderIsEnabled = false
  }

  @action enableScrollHeader = ({scrollTitle}: Object) => {
    this.scrollTitle = scrollTitle
    this.scrollHeaderIsEnabled = true
    this.progress = 0
  }

  @computed get progressPercentage (): string {
    return `${(this.progress * 100).toFixed(2)}%`
  }
}
