// @flow

import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import moment from 'moment'
import PropTypes from 'prop-types'
import stripTags from 'striptags'

import createPage from '../helpers/create-page'
import {getUrlObj, getFeaturedImageProps, getThumbnailImageProps} from '../helpers/post-data'

const Home = ({postsData}: Object, {siteData}: Object) => {
  return (
    <div>
      <Head>
        <title>{siteData.name}</title>

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

        <div className='bg-darken-0 sm-mb3 center p2 gray'>
          {siteData.description}
        </div>

        {postsData.map(postData => (
          <Link
            as={postData.link}
            href={getUrlObj(postData)}
            key={`Post${postData.id}`}
          >
            <a className='flex flex-wrap items-center mb2 sm-mb3'>
              <div className='col-12 sm-hide md-hide lg-hide'>
                <img
                  className='block fit bg-gray'
                  {...getFeaturedImageProps(postData)}
                />
              </div>

              <div className='xs-hide sm-col-4'>
                <img
                  className='block fit bg-gray'
                  {...getThumbnailImageProps(postData)}
                />
              </div>

              <div className='col-12 sm-col-8'>
                <div className='my2 page-x-spacing'>
                  <h2 className='my2 lora h1 line-height-3'>{postData.name}</h2>

                  <div
                    className='my2 gray line-clamp-3'
                    dangerouslySetInnerHTML={{__html: stripTags(postData.excerpt.rendered)}}
                  />

                  <div className='my2 gray'>{moment(postData.date).format('MMMM D, YYYY')}</div>
                </div>
              </div>
            </a>
          </Link>
        ))}

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
  fullWidth: true,
  maxWidth: 3,
  propPaths: () => ({
    postsData: '/wp/v2/posts?_embed&per_page=50'
  })
})
