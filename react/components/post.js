// @flow

import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
import Head from 'next/head'
import Link from 'next/link'
import moment from 'moment'
import PropTypes from 'prop-types'
import stripTags from 'striptags'

import Ad from '../components/ad'
import insertUnits from '../helpers/in-content-units'
import {getUrlObj, getFeaturedImageProps} from '../helpers/post-data'
import Related from '../components/sidebar/related'
import Share from '../components/share'
import Suggest from '../components/sidebar/suggest'
import styles from '../styles/pages/post.scss'

class Post extends Component {
  static contextTypes = {
    editableInterviewStore: PropTypes.object,
    headerStore: PropTypes.object
  }

  static defaultProps = {
    postData: {
      content: {},
      excerpt: {},
      title: {},
      _formatting: {},
      _social_links: {}
    },
    type: 'posts'
  }

  static displayName = 'Post'

  componentDidMount () {
    this.updateHeaderStore()
  }

  shouldComponentUpdate = () => true

  updateHeaderStore () {
    if (this.props.type === 'posts') {
      this.context.headerStore.enableScrollHeader({
        scrollTitle: this.props.postData.title.rendered
      })
    } else {
      this.context.headerStore.disableScrollHeader()
    }
  }

  render () {
    const ogImageData: ?Object = getFeaturedImageProps(this.props.postData, {
      sizes: ['large', 'medium_large'],
      returnLargestSizeData: true
    })

    return (
      <div>
        <Head>
          {this.props.postData.og_title || this.props.postData.title.rendered ? (
            <title>{this.props.postData.og_title || this.props.postData.title.rendered}</title>
          ) : null}

          <style dangerouslySetInnerHTML={{__html: styles}} />

          <meta
            content={stripTags(this.props.postData.excerpt.rendered)}
            name='description'
          />

          <meta
            content='article'
            property='og:type'
          />
          <meta
            content={this.props.postData.link}
            property='og:url'
          />
          <meta
            content={this.props.postData.og_title}
            property='og:title'
          />
          <meta
            content={stripTags(this.props.postData.excerpt.rendered)}
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

        <div className='mb2 sm-mb3'>
          {this.props.editable ? (
            <Dropzone
              className='col-12'
              onDrop={this.context.editableInterviewStore.handleFeaturedImageDrop}
            >
              <img
                className='col-12 bg-silver flex items-center justify-center'
                style={{height: '600px'}}
                {...this.context.editableInterviewStore.featuredImageProps}
              />
            </Dropzone>
          ) : (
            <img
              className='col-12 block'
              {...getFeaturedImageProps(this.props.postData, {sizes: ['large', 'medium_large']})}
            />
          )}
        </div>

        <div className='flex mb2'>
          <div className='col-12 md-flex-auto'>
            {!this.props.postData._formatting || !this.props.postData._formatting.hide_title ? (
              <h1 className='mb2 md-h0'>
                <Link
                  as={this.props.postData.link}
                  href={getUrlObj(this.props.postData)}
                >
                  <a>{this.props.postData.title.rendered}</a>
                </Link>
              </h1>
            ) : null}

            {this.props.type !== 'pages' ? (
              <div
                className='mb2 gray italic'
                dangerouslySetInnerHTML={{__html: stripTags(this.props.postData.excerpt.rendered)}}
              />
            ) : null}

            {this.props.type !== 'pages' ? (
              <div className='mb2 gray'>{moment(this.props.postData.date).format('MMMM D, YYYY')}</div>
            ) : null}

            {this.props.type !== 'pages' ? (
              <Share
                hackerNewsUrl={this.props.postData._social_links.hacker_news}
                position='Above Content'
                redditUrl={this.props.postData._social_links.reddit}
                title={this.props.postData.title.rendered}
                url={this.props.postData.link}
              />
            ) : null}

            <div
              className='mb3 serif post-content'
              dangerouslySetInnerHTML={{__html: insertUnits(this.props.postData.content.rendered, {
                skip: this.props.postData._formatting && this.props.postData._formatting.no_incontent_units
              })}}
              style={{fontSize: '1.125rem', lineHeight: '1.8'}}
            />

            {this.props.type !== 'pages' ? (
              <Share
                hackerNewsUrl={this.props.postData._social_links.hacker_news}
                position='Below Content'
                redditUrl={this.props.postData._social_links.reddit}
                title={this.props.postData.title.rendered}
                url={this.props.postData.link}
              />
            ) : null}
          </div>

          {!this.props.postData._formatting || !this.props.postData._formatting.no_sidebar ? (
            <div
              className='xs-hide sm-hide ml3'
              style={{flex: '0 0 300px'}}
            >
              <Ad
                className='mb3'
                height={600}
                width={300}
              />

              <Suggest className='mb3' />

              <Ad
                className='mb3'
                height={250}
                width={300}
              />

              <Related />
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

export default Post
