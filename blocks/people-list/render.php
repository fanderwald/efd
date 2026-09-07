<?php 
$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['is_preview'] = $is_preview;
$context['attributes'] = get_block_wrapper_attributes();

$context['people_focal_points'] = array();
$people = isset( $context['fields']['people_list'] ) ? $context['fields']['people_list'] : array();

foreach ( (array) $people as $person ) {
	$person_id = is_object( $person ) ? $person->ID : $person;
	$raw_focal_point = get_post_meta( $person_id, 'person_focal_point', true );
	$focal_point = is_string( $raw_focal_point ) ? json_decode( $raw_focal_point, true ) : array();
	$x = isset( $focal_point['x'] ) ? (float) $focal_point['x'] : 0.5;
	$y = isset( $focal_point['y'] ) ? (float) $focal_point['y'] : 0.5;

	$x = max( 0, min( 1, $x ) );
	$y = max( 0, min( 1, $y ) );
	$context['people_focal_points'][ $person_id ] = round( $x * 100, 2 ) . '% ' . round( $y * 100, 2 ) . '%';
}

Timber::render( 'render.twig', $context );
?>