// @flow

import React from 'react'
import Head from 'next/head'
import moment from 'moment'
import stripTags from 'striptags'

import createPage from '../helpers/create-page'
import {getFeaturedImageProps} from '../helpers/post-data'
import Link from '../helpers/link'
import Share from '../components/share'

const Post = ({postsData, url: {query: {type}}}) => {
  const postData = Array.isArray(postsData) ? postsData[0] : postsData
  const ogImageData: ?Object = getFeaturedImageProps(postData, {
    sizes: ['large', 'medium_large'],
    returnLargestSizeData: true
  })

  return (
    <div>
      <Head>
        <title>{postData.og_title}</title>

        <meta
          content={stripTags(postData.excerpt.rendered)}
          name='description'
        />

        <meta
          content='article'
          property='og:type'
        />
        <meta
          content={postData.link}
          property='og:url'
        />
        <meta
          content={postData.og_title}
          property='og:title'
        />
        <meta
          content={stripTags(postData.excerpt.rendered)}
          property='og:description'
        />
        {ogImageData ? (
          <meta
            content={ogImageData.source_url}
            property='og:image'
          />
        ) : null}
        {ogImageData ? (
          <meta
            content={ogImageData.height}
            property='og:image:height'
          />
        ) : null}
        {ogImageData ? (
          <meta
            content={ogImageData.width}
            property='og:image:width'
          />
        ) : null}
      </Head>

      <div className='my2 sm-my3'>
        <img
          className='block fit bg-gray'
          {...getFeaturedImageProps(postData, {sizes: ['large', 'medium_large']})}
        />
      </div>

      {!postData._formatting || !postData._formatting.hide_title ? (
        <h1 className='my2'>
          <Link href={postData.link}>{postData.title.rendered}</Link>
        </h1>
      ) : null}

      {type !== 'pages' ? (
        <div
          className='my2 gray italic'
          dangerouslySetInnerHTML={{__html: stripTags(postData.excerpt.rendered)}}
        />
      ) : null}

      {type !== 'pages' ? (
        <div className='my2 gray'>{moment(postData.date).format('MMMM D, YYYY')}</div>
      ) : null}

      {type !== 'pages' ? (
        <Share
          hackerNewsUrl={postData._social_links.hacker_news}
          position='Above Content'
          redditUrl={postData._social_links.reddit}
          title={postData.title.rendered}
          url={postData.link}
        />
      ) : null}

      <div
        className='my3 serif post-content'
        dangerouslySetInnerHTML={{__html: postData.content.rendered}}
        style={{fontSize: '1.125rem', lineHeight: '1.8'}}
      />

      {type !== 'pages' ? (
        <Share
          hackerNewsUrl={postData._social_links.hacker_news}
          position='Below Content'
          redditUrl={postData._social_links.reddit}
          title={postData.title.rendered}
          url={postData.link}
        />
      ) : null}

    </div>
  )
}

Post.displayName = 'Post'

export default createPage(Post, {
  propPaths: ({asPath, query: {p, preview, preview_id, preview_nonce, type, slug}}) => {
    let path

    if (preview) {
      path = `/wp/v2/${type}/${p || preview_id}/revisions?preview_nonce=${preview_nonce}`
    } else {
      path = `/wp/v2/${type}?_embed&slug=${slug}`
    }

    return {
      postsData: path
    }
  }
})
