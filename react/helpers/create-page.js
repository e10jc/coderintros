// @flow

import React, {Component} from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import store from 'store'
import 'isomorphic-fetch'

import aceCss from '../styles/ace.css'
import appStyles from '../styles/app.scss'
import {createModalStore} from '../helpers/create-modal'
import EmailModal from '../components/modals/email'
import Footer from '../components/footer'
import {getFetchHeaders, getWordpressUrl} from './fetch'
import Header from '../components/header'
import LikeModal, {didLikeFBPageStoreKey} from '../components/modals/like'
import SitePassword from '../components/site-password'
import trackEvent from '../helpers/track-event'

export const pageXSpacing = 'mx2 md-mx0'

export default function (Child: Object, {
  propPaths = () => ({}),
  childContextTypes = {},
  getChildContext = () => ({})
}: Object = {}) {
  class Page extends Component {
    static childContextTypes = Object.assign({}, {
      emailModalStore: PropTypes.object,
      likeModalStore: PropTypes.object,
      pagesData: PropTypes.array,
      siteData: PropTypes.object
    }, childContextTypes)

    static async getInitialProps ({asPath, req, query}) {
      const paths = Object.assign({}, {
        pagesData: '/wp/v2/pages?orderby=menu_order&order=asc',
        siteData: '/ci/site_details'
      }, propPaths({asPath, query}))
      const pathsKeys = Object.keys(paths)

      const fetchCache = global.__FETCH__DATA__ || {}

      let fetches = await Promise.all(pathsKeys.map(async k => {
        const input = paths[k]
        const [path, authorize] = typeof input === 'string' ? [input, false] : [input.path, input.authorize]

        if (fetchCache[path]) {
          return fetchCache[path]
        }

        const res = await global.fetch(getWordpressUrl(path), {
          credentials: authorize ? 'include' : 'omit',
          headers: getFetchHeaders(path, {
            authorize,
            cookiejar: req ? req.headers.cookie : window.document.cookie
          })
        })

        fetchCache[path] = await res.json()

        return fetchCache[path]
      }))

      const finalProps = pathsKeys.reduce((obj, key, i) => {
        obj[key] = fetches[i]
        return obj
      }, {})

      finalProps.fetchCache = fetchCache

      if (finalProps.siteData.site_password_enabled) {
        finalProps.passwordRequired = true

        if (query.password) {
          const res = await global.fetch(getWordpressUrl('/ci/site_password'), {
            method: 'POST',
            headers: getFetchHeaders(),
            body: query.password
          })

          if (res.status >= 200 && res.status < 400) {
            finalProps.passwordRequired = false
          }
        }
      }

      return finalProps
    }

    getChildContext = () => Object.assign({}, {
      emailModalStore: this.emailModalStore,
      likeModalStore: this.likeModalStore,
      pagesData: this.props.pagesData,
      siteData: this.props.siteData
    }, getChildContext.call(this))

    componentWillMount () {
      this.emailModalStore = createModalStore()
      this.likeModalStore = createModalStore()
    }

    componentDidMount () {
      if (this.props.siteData.facebook_modal_delay) {
        setTimeout(() => {
          if (!store.get(didLikeFBPageStoreKey) && !this.emailModalStore.isOpen) {
            this.likeModalStore.open({autoOpened: true})
            trackEvent({
              eventCategory: 'Modals',
              eventAction: 'Auto-Opened Like'
            })
          }
        }, this.props.siteData.facebook_modal_delay)
      }
    }

    shouldComponentUpdate = () => false

    emailModalStore: Object
    likeModalStore: Object

    render () {
      return (
        <div>
          <Head>
            <style dangerouslySetInnerHTML={{__html: aceCss}} />
            <style dangerouslySetInnerHTML={{__html: appStyles}} />
          </Head>

          <div className='max-width-3 mx-auto sans-serif black'>
            <Header />

            <main className='flex-auto bg-white'>
              {this.props.passwordRequired ? (
                <SitePassword />
              ) : (
                <Child {...this.props} />
              )}
            </main>

            <Footer />
          </div>

          <EmailModal store={this.emailModalStore} />
          <LikeModal store={this.likeModalStore} />

          <script dangerouslySetInnerHTML={{__html: `window.__FETCH__DATA__ = ${JSON.stringify(this.props.fetchCache)}`}} />
        </div>
      )
    }
  }

  return Page
}
