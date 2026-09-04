<?php
/**
 * Register custom block editor blocks.
 *
 * @package FoundationPress
 * @since FoundationPress 1.0.0
 */

function custom_block_category( $categories ) {
    return array_merge(
        array(
            array(
                'slug' => 'custom-blocks',
                'title' => __( 'Custom Components', 'my-blocks' ),
            ),
        ),
        $categories
    );
}
add_filter( 'block_categories_all', 'custom_block_category', 10, 2 );


add_action( 'init', 'register_acf_blocks');
function register_acf_blocks() {
    register_block_type( __DIR__ . '/../blocks/call-to-action' );
    register_block_type( __DIR__ . '/../blocks/context-nav' );
    register_block_type( __DIR__ . '/../blocks/factoids' );
    register_block_type( __DIR__ . '/../blocks/icon-card' );
    register_block_type( __DIR__ . '/../blocks/impact-scroll' );
    register_block_type( __DIR__ . '/../blocks/info-card' );
    register_block_type( __DIR__ . '/../blocks/jumbo-list' );
    register_block_type( __DIR__ . '/../blocks/story' );
    register_block_type( __DIR__ . '/../blocks/story-grid' );
	register_block_type( __DIR__ . '/../blocks/story-section' );
    register_block_type( __DIR__ . '/../blocks/topper-carousel-content' );
    register_block_type( __DIR__ . '/../blocks/topper-carousel-leader' );
    register_block_type( __DIR__ . '/../blocks/topper-carousel-grid' );
    register_block_type( __DIR__ . '/../blocks/topper-cover' );
    register_block_type( __DIR__ . '/../blocks/topper-split' );
    register_block_type( __DIR__ . '/../blocks/video-mp4' );
}

?>