// @flow

import React, {PureComponent} from 'react'
import {observer} from 'mobx-react'
import Link from 'next/link'
import 'isomorphic-fetch'

import {getFetchHeaders, getWordpressUrl} from '../helpers/fetch'
import {getUrlObj, getThumbnailImageProps} from '../helpers/post-data'
import RelatedStore from '../stores/related'

@observer
class Related extends PureComponent {
  componentWillMount () {
    this.store = new RelatedStore()
  }

  componentDidMount () {
    this.loadRelatedPosts()
  }

  async loadRelatedPosts () {
    const res = await global.fetch(getWordpressUrl(`/wp/v2/posts?more_like=${this.props.postData.id}&per_page=4&_embed`), {
      headers: getFetchHeaders()
    })
    const json = await res.json()
    this.store.postsData = json
  }

  props: {
    postData: Object
  }
  store: Object

  render () {
    if (!this.store.postsData.length) {
      return null
    }

    return (
      <div className='bg-darken-0'>
        <div className='page-x-spacing py2'>
          <div className='h3 mb2 mt1 gray line-height-3'>{'Related Profiles'}</div>

          <div className='flex flex-wrap mxn1'>
            {this.store.postsData.map((postData, i) => (
              <Link
                as={postData.link}
                href={getUrlObj(postData)}
                key={`Related${postData.id}`}
              >
                <a className={`col-4 sm-col-3 block px1 ${i === 3 ? 'xs-hide' : ''}`}>
                  <img
                    className='block fit col-12'
                    {...getThumbnailImageProps(postData)}
                  />

                  <div className='p1 mb1 line-height-3 gray bg-white'>{postData.name}</div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default Related
