<?php

// Add additional image sizes
add_image_size( 'fp-xsmall', 320 );
add_image_size( 'fp-small', 640 );
add_image_size( 'fp-plus', 800 );
add_image_size( 'fp-medium', 1024 );
add_image_size( 'fp-xmedium', 1280 );
add_image_size( 'fp-large', 1440 );
add_image_size( 'fp-xlarge', 1680 );
add_image_size( 'fp-xxlarge', 1920 );

// Register the new image sizes for use in the add media modal in wp-admin
function foundationpress_custom_sizes( $sizes ) {
	return array_merge(
		$sizes, array(
			'fp-xsmall'  => __( 'FP XSmall' ),
			'fp-small'  => __( 'FP Small' ),
			'fp-plus'  => __( 'FP Plus' ),
			'fp-medium' => __( 'FP Medium' ),
			'fp-xmedium' => __( 'FP XMedium' ),
			'fp-large'  => __( 'FP Large' ),
			'fp-xlarge' => __( 'FP XLarge' ),
			'fp-xlarge' => __( 'FP XXLarge' ),
		)
	);
}
add_filter( 'image_size_names_choose', 'foundationpress_custom_sizes' );
