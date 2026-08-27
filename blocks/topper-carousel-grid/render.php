<?php 
$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['is_preview'] = $is_preview;
$context['attributes'] = get_block_wrapper_attributes();

$focal_point_css = '50% 50%';
$raw_focal_point = null;

if ( isset( $block['focalPoint'] ) ) {
	$raw_focal_point = $block['focalPoint'];
} elseif ( isset( $block['attrs']['focalPoint'] ) ) {
	$raw_focal_point = $block['attrs']['focalPoint'];
} elseif ( isset( $block['data']['focalPoint'] ) ) {
	$raw_focal_point = $block['data']['focalPoint'];
}

if ( is_string( $raw_focal_point ) ) {
	$decoded = json_decode( $raw_focal_point, true );
	if ( is_array( $decoded ) ) {
		$raw_focal_point = $decoded;
	}
}

if ( is_array( $raw_focal_point ) ) {
	$x = isset( $raw_focal_point['x'] ) ? (float) $raw_focal_point['x'] : 0.5;
	$y = isset( $raw_focal_point['y'] ) ? (float) $raw_focal_point['y'] : 0.5;

	$x = max( 0, min( 1, $x ) );
	$y = max( 0, min( 1, $y ) );

	$focal_point_css = round( $x * 100, 2 ) . '% ' . round( $y * 100, 2 ) . '%';
}

$context['focal_point_css'] = $focal_point_css;

$landscape = get_field('hero_image');
$portrait  = get_field('hero_image_mobile');
$context['landscape_image'] = $landscape;
$context['portrait_image']  = $portrait ?: $landscape;

Timber::render( 'render.twig', $context );
?>