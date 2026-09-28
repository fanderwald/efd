<?php
/**
 * Enqueue all styles and scripts
 *
 * Learn more about enqueue_script: {@link https://codex.wordpress.org/Function_Reference/wp_enqueue_script}
 * Learn more about enqueue_style: {@link https://codex.wordpress.org/Function_Reference/wp_enqueue_style }
 *
 * @package FoundationPress
 * @since FoundationPress 1.0.0
 */


// Check to see if rev-manifest exists for CSS and JS static asset revisioning
//https://github.com/sindresorhus/gulp-rev/blob/master/integration.md

use FoundationPress\Vite;

if ( ! function_exists( 'foundationpress_scripts' ) ) :
    function foundationpress_scripts() {
        // Enqueue Adobe Fonts or web fonts
        wp_enqueue_style( 'adobe-fonts', 'https://use.typekit.net/bep7pnj.css', array(), null, 'all' );

        // Ensure WordPress core jQuery is loaded for plugins
        wp_enqueue_script( 'jquery' );

        if ( Vite\is_dev() ) {
            // Development: Vite HMR client + direct source entries
            wp_enqueue_script( 'vite-client', Vite\get_vite_host() . '/@vite/client', array(), null, true );
            wp_enqueue_style( 'vite-app-css', Vite\asset_url( 'src/assets/scss/app.scss' ), array(), null, 'all' );
            wp_enqueue_script( 'foundation', Vite\asset_url( 'src/assets/js/app.js' ), array( 'jquery', 'vite-client' ), null, true );
        } else {
            // Production: Load compiled CSS and JS from manifest
            $css_url = Vite\asset_url( 'src/assets/scss/app.scss' );
            if ( ! empty( $css_url ) ) {
                wp_enqueue_style( 'main-stylesheet', $css_url, array(), null, 'all' );
            }

            $js_url = Vite\asset_url( 'src/assets/js/app.js' );
            if ( ! empty( $js_url ) ) {
                wp_enqueue_script( 'foundation', $js_url, array( 'jquery' ), null, true );
            }
        }

        // Comment reply script
        if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
            wp_enqueue_script( 'comment-reply' );
        }
    }

    add_action( 'wp_enqueue_scripts', 'foundationpress_scripts' );
endif;

/**
 * Enqueue editor assets in Gutenberg block editor.
 */
if ( ! function_exists( 'foundationpress_editor_scripts' ) ) :
    function foundationpress_editor_scripts() {
        if ( Vite\is_dev() ) {
            wp_enqueue_script( 'vite-client', Vite\get_vite_host() . '/@vite/client', array(), null, true );
            wp_enqueue_style( 'vite-editor-css', Vite\asset_url( 'src/assets/scss/editor.scss' ), array(), null, 'all' );
        }
    }

    add_action( 'enqueue_block_editor_assets', 'foundationpress_editor_scripts' );

    add_action( 'enqueue_block_assets', function() {
        if ( is_admin() && Vite\is_dev() ) {
            wp_enqueue_style( 'vite-editor-canvas-css', Vite\asset_url( 'src/assets/scss/editor.scss' ), array(), null, 'all' );
        }
    } );

    add_filter( 'block_editor_settings_all', function( $editor_settings ) {
        if ( Vite\is_dev() ) {
            $editor_settings['styles'][] = array(
                'css'            => "@import url('" . Vite\asset_url( 'src/assets/scss/editor.scss' ) . "');",
                '__unstableType' => 'theme',
                'isGlobalStyles' => false,
            );
        }
        return $editor_settings;
    } );
endif;

function foundationpress_person_focal_point_script() {
	$screen = get_current_screen();
	if ( ! $screen || 'people' !== $screen->post_type || ! $screen->is_block_editor() ) {
		return;
	}

		wp_enqueue_script(
			'person-focal-point',
			get_template_directory_uri() . '/src/assets/js/person-focal-point.js',
			array( 'wp-components', 'wp-data', 'wp-edit-post', 'wp-element', 'wp-plugins' ),
			filemtime( get_template_directory() . '/src/assets/js/person-focal-point.js' ),
			true
		);
}
add_action( 'admin_enqueue_scripts', 'foundationpress_person_focal_point_script' );
