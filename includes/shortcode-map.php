<?php
function return_shortcode_map( $atts ) {
    // initialize some variables
    $missionary_array = array();
    $no_location_array = array();
    $shortcode_output = NULL;

    // WP_Query arguments
    $missionary_query_args = array (
        'post_type'              => array( 'wwntbm_missionaries' ),
        'post_status'            => array( 'publish' ),
        'posts_per_page'         => '-1',
        'cache_results'          => true,
        'update_post_meta_cache' => true,
        'update_post_term_cache' => true,
        'order'                  => 'ASC',
        'orderby'                => 'meta_value',
        'meta_key'               => 'missionary_key',
    );

    // The Query
    $missionary_query = new WP_Query( $missionary_query_args );

    // The Loop
    if ( $missionary_query->have_posts() ) {
        while ( $missionary_query->have_posts() ) {
            $missionary_query->the_post();

            // get info
            $id = get_the_ID();
            $missionary_key = get_field( 'missionary_key' );
            if ( get_field( 'location' ) ) {
                $location = get_field( 'location' );
            } else {
                $location['lat'] = NULL;
                $location['lng'] = NULL;
            }
            $status = get_the_terms( $id, 'wwntbm_status' );
            $ministry_categories_string = get_the_term_list( $id, 'wwntbm_ministries', NULL, ', ' );
            $status_categories_string = get_the_term_list( $id, 'wwntbm_status', NULL, ', ' );

            // set up this missionary info
            $this_missionary = array(
                'id'                => $id,
                'name'              => get_the_title(),
                'link'              => get_permalink(),
                'image'             => wp_get_attachment_image( get_post_thumbnail_id( get_the_ID()), 'category-thumb', false, array( 'class' => 'rounded shadowed' ) ),
                'lat'               => $location['lat'],
                'lng'               => $location['lng'],
                'status'            => $status,
                'type_string'       => $ministry_categories_string,
                'status_string'     => $status_categories_string,
            );

            // add to locations array
            if ( $location['lat'] && $location['lng'] ) {
                $missionary_array[] = $this_missionary;
            } else {
                $no_location_array[] = $this_missionary;
            }
        }
    } else {
        // no posts found
    }

    // Restore original Post Data
    wp_reset_postdata();

    // include front-end scripts
    wp_enqueue_script( 'google-map-api' );
    wp_enqueue_script( 'wwntbm-missionaries-map' );
    wp_enqueue_style( 'wwntbm-missionaries-map' );

    // output map
    $shortcode_output .= '<div id="map"></div>';

    // output people with no location
    $shortcode_output .= '<hr/>
    <h2>Not listed on map</h2>';
    foreach( $no_location_array as $missionary ) {
        $shortcode_output .= return_missionary( $missionary['id'], $missionary['name'], $missionary['link'], $missionary['image'], $missionary['status'], $missionary['type_string'], $missionary['status_string'] );
    }
    // output data
    wp_localize_script( 'wwntbm-missionaries-map', 'wwntbmMissionaries', $missionary_array );
    return $shortcode_output;
}
