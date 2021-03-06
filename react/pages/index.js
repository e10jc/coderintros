// @flow

import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import PropTypes from 'prop-types'
import stripTags from 'striptags'

import Tagline from '../components/tagline'
import createPage from '../helpers/create-page'
import {didPassPasswordAuthorization, getUrlObj, getFeaturedImageProps, getThumbnailImageProps} from '../helpers/post-data'
import styles from '../styles/pages/index.scss'

export const Home = ({pageData, postsData}: Object, {siteData}: Object) => {
  return (
    <div>
      <Head>
        <title>{siteData.name}</title>

        <style dangerouslySetInnerHTML={{__html: styles}} />

        <meta
          content={siteData.description}
          name='description'
        />

        <meta
          content='website'
          property='og:type'
        />
        <meta
          content={siteData.home}
          property='og:url'
        />
        <meta
          content={siteData.name}
          property='og:title'
        />
        <meta
          content={siteData.description}
          property='og:description'
        />
        <meta
          content={siteData.images.og}
          property='og:image'
        />
      </Head>

      <div className='sm-page-x-spacing'>
        <hr />

        <div className='bg-darken-0 sm-mb3 center p2 muted'>
          {siteData.description}
        </div>

        {postsData.length ? postsData.filter(didPassPasswordAuthorization).map(postData => (
          <Link
            as={postData.link}
            href={getUrlObj(postData)}
            key={`Post${postData.id}`}
          >
            <a className='flex flex-wrap items-center mb3 sm-mb3'>
              <div className='col-12 sm-hide md-hide lg-hide'>
                <img
                  className='block fit bg-gray'
                  {...getFeaturedImageProps(postData)}
                />
              </div>

              <div className='xs-hide sm-col-3'>
                <img
                  className='block fit bg-gray'
                  {...getThumbnailImageProps(postData)}
                />
              </div>

              <div className='col-12 sm-col-9'>
                <div className='my2 page-x-spacing'>
                  <h2 className='my1 lora h1 line-height-3'>{postData.name}</h2>

                  <div
                    className='my1 gray line-clamp-3'
                    dangerouslySetInnerHTML={{__html: stripTags(postData.excerpt.rendered)}}
                  />

                  <Tagline
                    className='my1 h5'
                    postData={postData}
                  />
                </div>
              </div>
            </a>
          </Link>
        )) : (
          <div className='center my3 h2'>{'No articles published yet.'}</div>
        )}

        <hr />
      </div>
    </div>
  )
}

Home.displayName = 'Home'

Home.contextTypes = {
  siteData: PropTypes.object
}

export default createPage(Home, {
  autoOpenFacebookModal: true,
  fullWidth: true,
  maxWidth: 3,
  propPaths: ({query: {preview}}) => ({
    pageData: {
      path: '/wp/v2/pages?slug=home',
      makeSingle: true
    },
    postsData: {
      authorize: !!preview,
      path: `/wp/v2/posts?_embed&per_page=50${preview ? '&status[]=pending&status[]=publish' : ''}`
    }
  })
})
