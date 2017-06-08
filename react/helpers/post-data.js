// @flow

import React from 'react'

const defaultImageSrc = '/static/img/default.svg'

export function featuredImage (postData: Object, {size = 'large'}: Object) {
  const imageData = postData._embedded && postData._embedded['wp:featuredmedia'] && postData._embedded['wp:featuredmedia'][0]
  const foundSize = imageData ? Object.keys(imageData.media_details.sizes).find(k => k === size) : null

  return (
    <img
      alt={imageData ? imageData.alt_text : 'default'}
      className='block fit bg-gray'
      src={imageData && foundSize ? imageData.media_details.sizes[foundSize].source_url : defaultImageSrc}
    />
  )
}
