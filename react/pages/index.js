// @flow

import React from 'react'
import Head from 'next/head'
import moment from 'moment'
import PropTypes from 'prop-types'
import stripTags from 'striptags'

import createPage from '../components/page'
import {featuredImage} from '../helpers/post-data'
import Link from '../helpers/link'

const Home = ({postsData}: Object, {siteData}: Object) => {
  return (
    <div>
      <Head>
        <title>{siteData.name}</title>
        <meta
          content={siteData.description}
          name='description'
        />
      </Head>

      <hr className='mt3 mb3 sm-mb4' />

      {postsData.map(postData => (
        <Link
          className='flex flex-wrap items-center my3'
          href={postData.link}
          key={`Post${postData.id}`}
        >
          <div className='col-3 sm-col-4'>
            {featuredImage(postData, {size: 'medium_large'})}
          </div>

          <div className='col-9 sm-col-8'>
            <div className='my2 ml3'>
              <h1 className='my2'>{postData.title.rendered}</h1>

              <div
                className='my2 gray'
                dangerouslySetInnerHTML={{__html: stripTags(postData.excerpt.rendered)}}
              />

              <div className='my2 h5 gray'>{moment(postData.date).format('MMMM D, YYYY')}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

Home.displayName = 'Home'

Home.contextTypes = {
  siteData: PropTypes.object
}

export default createPage(Home, {
  propPaths: () => ({
    postsData: '/wp/v2/posts?_embed'
  })
})
