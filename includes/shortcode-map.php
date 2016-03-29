<?php
// collect data
$missionary_array = array();
$no_location_array = array();

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

        // add to array
        if ( $location['lat'] && $location['lng'] ) {
            $missionary_array[] = array(
                'id'        => $id,
                'name'      => get_the_title(),
                'link'      => get_permalink(),
                'image'     => wp_get_attachment_image( get_post_thumbnail_id( get_the_ID()), 'category-thumb', false, array( 'class' => 'rounded shadowed' ) ),
                'lat'       => $location['lat'],
                'lng'       => $location['lng'],
            );
        } else {
            $no_location_array[] = array(
                'id'        => $id,
                'name'      => get_the_title(),
                'link'      => get_permalink(),
                'image'     => wp_get_attachment_image( get_post_thumbnail_id( get_the_ID()), 'category-thumb', false, array( 'class' => 'rounded shadowed' ) ),
                'lat'       => $location['lat'],
                'lng'       => $location['lng'],
            );
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
echo '<div id="map"></div>';

// output people with no location
echo '<hr/>
<h2>Not listed on map</h2>';
foreach( $no_location_array as $missionary ) {
    print_missionary( $missionary['id'], $missionary['name'], $missionary['link'], $missionary['image'] );
}
// output data
wp_localize_script( 'wwntbm-missionaries-map', 'wwntbmMissionaries', $missionary_array );
