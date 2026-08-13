<?php
/**
 * Register theme support for languages, menus, post-thumbnails, post-formats etc.
 *
 * @package FoundationPress
 * @since FoundationPress 1.0.0
 */

if ( ! function_exists( 'foundationpress_theme_support' ) ) :
	function foundationpress_theme_support() {
		// Add language support
		load_theme_textdomain( 'foundationpress', get_template_directory() . '/languages' );

		// Switch default core markup for search form, comment form, and comments to output valid HTML5
		add_theme_support(
			'html5', array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			)
		);

		add_theme_support( 'menus' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'post-formats', array( 'aside', 'gallery', 'link', 'image', 'quote', 'status', 'video', 'audio', 'chat' ) );

		add_theme_support( 'editor-styles' );
		add_editor_style( '/dist/assets/css/' . foundationpress_asset_path( 'editor.css' ) );
		add_editor_style( 'https://use.typekit.net/bep7pnj.css' );

		add_theme_support( 'responsive-embeds' );
	}

	add_action( 'after_setup_theme', 'foundationpress_theme_support' );
endif;

add_action( 'init', function() {
    register_block_style(
        'core/paragraph',
        array(
            'name'  => 'micro-heading',
            'label' => __( 'Micro Heading', 'foundationpress' ),
        )
    );
	register_block_style(
        'core/list',
        array(
            'name'  => 'jumbo-list',
            'label' => __( 'Jumbo List', 'foundationpress' ),
        )
    );
    register_block_style(
        'core/group',
        array(
            'name'  => 'rounded-corners',
            'label' => __( 'Rounded Corners', 'foundationpress' ),
        )
    );
} );