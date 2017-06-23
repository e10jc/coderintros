// @flow

import React from 'react'

import createPage from '../helpers/create-page'
import Post from '../components/post'

const extractPostData = ({postsData, revisionsData}: Object) => Object.assign({},
  Array.isArray(postsData) ? postsData[0] : postsData,
  revisionsData ? revisionsData[0] : {}
)

const Singular = ({postsData, revisionsData, url: {query: {type}}}: Object) => (
  <Post
    postData={extractPostData({postsData, revisionsData})}
    type={type}
  />
)

Singular.displayName = 'Singular'

export default createPage(Singular, {
  fullWidth: true,
  hrTop: false,
  maxWidth: (props: Object) => {
    const postData = extractPostData(props)
    return postData._formatting && postData._formatting.no_sidebar ? '3' : '4'
  },
  propPaths: ({asPath, query: {p, page_id, preview, preview_id, type, slug}}) => ({
    postsData: {
      authorize: !!preview,
      path: (p || page_id) ? `/wp/v2/${type}/${p || page_id}/?_embed` : `/wp/v2/${type}?_embed&slug=${slug}`
    },
    revisionsData: preview ? {
      authorize: true,
      path: `/wp/v2/${type}/${p || page_id || preview_id}/revisions`
    } : null
  })
})
