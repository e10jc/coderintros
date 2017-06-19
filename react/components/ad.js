// @flow

import React from 'react'

const getSizeClassName = showAt => {
  if (!showAt.length) {
    return ''
  } else {
    return ['xs', 'sm', 'md', 'lg'].map(s =>
      !showAt.includes(s) ? `${s}-hide` : ''
    ).join(' ')
  }
}

const Ad = ({className = '', showAt = [], width, height}: Object) => (
  <div
    className={`bg-silver ${className} ${getSizeClassName(showAt)}`}
    style={{width, height}}
  >
    {''}
  </div>
)

export default Ad
