// @flow

import React, {Component} from 'react'
import classNames from 'classnames'
import getHeight from 'dom-helpers/query/height'
import getScrollTop from 'dom-helpers/query/scrollTop'
import Link from 'next/link'
import PropTypes from 'prop-types'
import raf from 'raf'
import {
  IoIosEmailOutline as EmailIcon,
  IoSocialFacebookOutline as FacebookIcon,
  IoShare as ShareIcon
} from 'react-icons/lib/io'
import {observer, PropTypes as MobxReactPropTypes} from 'mobx-react'

@observer
class Header extends Component {
  static contextTypes = {
    emailModalStore: MobxReactPropTypes.observableObject,
    headerStore: MobxReactPropTypes.observableObject,
    likeModalStore: MobxReactPropTypes.observableObject,
    pagesData: PropTypes.array,
    siteData: PropTypes.object
  }

  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleScroll)
  }

  handleScroll = () => {
    raf(this.updateScrollHeader)
  }

  updateScrollHeader = () => {
    if (this.context.headerStore.scrollHeaderIsEnabled) {
      const containerRect = this.node.getBoundingClientRect()

      if (!this.context.headerStore.scrollHeaderIsVisible && window.pageYOffset > containerRect.height) {
        this.context.headerStore.scrollHeaderIsVisible = true
      } else if (this.context.headerStore.scrollHeaderIsVisible && window.pageYOffset <= containerRect.height) {
        this.context.headerStore.scrollHeaderIsVisible = false
      }

      if (this.context.headerStore.progress !== 1) {
        const scrollTop = getScrollTop(document.body)
        const clientHeight = getHeight(document.body, true)
        const scrollHeight = document.body ? document.body.scrollHeight : 0
        const decimal = scrollTop / (scrollHeight - clientHeight)
        this.context.headerStore.progress = decimal
      }
    }
  }

  node: Object

  render () {
    return (
      <header>
        {this.context.headerStore.scrollHeaderIsEnabled && (
          <div
            className={classNames([
              'fixed z1 top-0 right-0 left-0 header-scroll',
              {'header-scroll-hide': !this.context.headerStore.scrollHeaderIsVisible},
              {'header-scroll-show': this.context.headerStore.scrollHeaderIsVisible}])}
          >
            <div className='absolute top-0 right-0 bottom-0 left-0 flex items-center'>
              <div
                className='row-12 header-progress-gradient'
                style={{flex: `0 0 ${this.context.headerStore.progressPercentage}`}}
              />

              <div
                className='header-bg-black row-12 relative'
                style={{flex: '0 0 20px'}}
              >
                <div className='row-12 header-progress-arrow' />
              </div>

              <div className='flex-auto row-12 header-bg-black flex items-center'>
                <div
                  className='header-progress-text'
                  dangerouslySetInnerHTML={{__html: this.context.headerStore.progressPercentage}}
                />
              </div>
            </div>

            <div
              className={classNames([
                'row-12 header-progress-finished',
                {'col-12': this.context.headerStore.progress === 1}])}
            />

            <div className='absolute top-0 right-0 bottom-0 left-0 flex items-center justify-between max-width-4 mx-auto'>
              <div className='row-12 flex-auto flex items-center'>
                <img
                  alt={`${this.context.siteData.name} logo`}
                  className='fit block mx1 header-scroll-logo'
                  src={this.context.siteData.images['apple-icon-180x180']}
                />

                {this.context.headerStore.scrollTitle && (
                  <div className='white h3 nowrap'>{this.context.headerStore.scrollTitle}</div>
                )}
              </div>

              <a
                className='icon-wrapper block white h6 ups mx1 p1 hide'
                href='javascript:void(0)'
              >
                <ShareIcon />
                <span>{'Share'}</span>
              </a>
            </div>
          </div>
        )}

        <div ref={r => { this.node = r }}>
          <div className='flex items-center justify-between py2 md-py3 bg-white'>
            <div>
              <a
                className='inline-block'
                data-ga-event-action='Opened Email From Header'
                data-ga-event-category='Modals'
                data-ga-on='click'
                href='javascript:void(0)'
                onClick={this.context.emailModalStore.handleOpen}
              >
                <EmailIcon className='header-icon' />
              </a>
            </div>

            <div className='flex-auto center'>
              <Link href='/'>
                <a className='block col-12 header-logo mx-auto'>
                  <img
                    alt={`${this.context.siteData.name} logo`}
                    className='block fit'
                    src={this.context.siteData.images.logo}
                  />
                </a>
              </Link>
            </div>

            <div>
              {this.context.siteData.facebook_page_url && (
                <a
                  className='inline-block'
                  data-ga-event-action='Opened Like From Header'
                  data-ga-event-category='Modals'
                  data-ga-on='click'
                  href='javascript:void(0)'
                  onClick={this.context.likeModalStore.handleOpen}
                >
                  <FacebookIcon className='header-icon' />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default Header
