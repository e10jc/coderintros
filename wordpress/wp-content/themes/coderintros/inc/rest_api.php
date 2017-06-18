<?php

// add formatting options to object responses
add_action( 'rest_api_init', function () {
  function formatting_callback ( $object ) {
    return [
      'full_width' => get_post_meta( $object['id'], 'full_width', true ) == '1',
      'hide_title' => get_post_meta( $object['id'], 'hide_title', true ) == '1'
    ];
  }

  register_rest_field( 'page', '_formatting', ['get_callback' => 'formatting_callback'] );
  register_rest_field( 'post', '_formatting', ['get_callback' => 'formatting_callback'] );
} );

// add social links to posts
add_action( 'rest_api_init', function () {
  register_rest_field( 'post', '_social_links', [
    'get_callback' => function ( $object ) {
      return [
        'hacker_news' => get_post_meta( $object['id'], 'hacker_news_url', true ),
        'reddit' => get_post_meta( $object['id'], 'reddit_url', true )
      ];
    }
  ] );
} );

// add profile to posts
add_action( 'rest_api_init', function () {
  register_rest_field( 'post', '_profile', [
    'get_callback' => function ( $object ) {
      return [
        'blurb' => get_post_meta( $object['id'], 'blurb', true )
      ];
    }
  ] );
} );

// add custom social titles to posts
add_action( 'rest_api_init', function () {
  register_rest_field( 'post', 'og_title', [
    'get_callback' => function ( $object ) {
      $blurb = get_post_meta( $object['id'], 'blurb', true );
      $title = 'Meet ' . get_the_title( $object['id' ]);
      return empty( $blurb ) ? $title : $title . ', ' . $blurb;
    }
  ] );
} );

// add a custom endpoint for site details
add_action( 'rest_api_init', function () {
  register_rest_route( 'ci', '/site_details', [
    'methods' => 'GET',
    'callback' => function () {
      $image_names = ['logo', 'apple-icon-57x57', 'apple-icon-60x60',
        'apple-icon-72x72', 'apple-icon-76x76', 'apple-icon-114x114',
        'apple-icon-120x120', 'apple-icon-144x144', 'apple-icon-152x152',
        'apple-icon-180x180', 'android-icon-192x192', 'favicon-32x32',
        'favicon-96x96', 'favicon-16x16', 'ms-icon-144x144', 'og'];

      $logo_query = new WP_Query([
        'posts_per_page' => sizeof( $image_names ),
        'post_status' => 'inherit',
        'post_type' => 'attachment',
        'post_name__in' => $image_names
      ]);

      $finalArray = [
        'name' => get_bloginfo( 'name' ),
        'description' => get_bloginfo( 'description' ),
        'home' => get_home_url(),
        'images' => [],
        'facebook_app_id' => get_option( 'facebook_app_id' ),
        'facebook_page_url' => get_option( 'facebook_page_url' ),
        'facebook_modal_title' => get_option( 'facebook_modal_title' ),
        'facebook_modal_title_auto_open' => get_option( 'facebook_modal_title_auto_open' ),
        'facebook_modal_body' => get_option( 'facebook_modal_body' ),
        'facebook_modal_body_auto_open' => get_option( 'facebook_modal_body_auto_open' ),
        'facebook_modal_delay' => intval( get_option( 'facebook_modal_delay' ) ),
        'ga_tracking_id' => get_option( 'ga_tracking_id' ),
        'mailchimp_form_html' => get_option( 'mailchimp_form_html' ),
        'site_password_enabled' => ! empty( get_option( 'site_password' ) ),
        'sites' => []
      ];

      foreach ( $image_names as $image_name ) {
        $post = array_search_for_key( 'post_name', $image_name, $logo_query->posts );
        if ( $post ) {
          $finalArray['images'][$image_name] = wp_get_attachment_url( $post->ID );
        }
      }

      foreach ( get_sites( ['public' => 1] ) as $site ) {
        array_push( $finalArray['sites'], $site->domain );
      }

      return $finalArray;
    },
  ] );
} );

// add a custom endpoint to validate site password
add_action( 'rest_api_init', function () {
  register_rest_route( 'ci', '/site_password', [
    'methods' => 'POST',
    'callback' => function ( $request ) {
      if ( $request->get_body() != get_option( 'site_password' ) ) {
        return new WP_Error(
          'invalid_site_password',
          'Invalid site password',
          ['status' => 401]
        );
      }
    },
  ] );
} );

// add cache control headers
add_action( 'rest_post_dispatch', function ( $result ) {
  $result->headers['Cache-Control'] = 'public';
  return $result;
} );
