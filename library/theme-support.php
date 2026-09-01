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

function my_theme_register_button_styles() {
    register_block_style(
        'core/button',
        array(
            'name'  => 'fill',
            'label' => __('Fill', 'foundationpress'),
            'inline_style' => '
            .wp-block-button.is-style-fill .wp-block-button__link { 
            border: 2px solid var(--wp--preset--color--primary); 
            background-color: var(--wp--preset--color--primary); 
            color: var(--wp--preset--color--cloud); 
            } 
            .wp-block-button.is-style-fill .wp-block-button__link:hover { 
            border: 2px solid var(--wp--preset--color--yellow-green);
            background-color: var(--wp--preset--color--yellow-green); 
            color: var(--wp--preset--color--primary); 
            }'
        )
    );
    register_block_style(
        'core/button',
        array(
            'name'  => 'fill-cloud',
            'label' => __('Fill - Cloud', 'foundationpress'),
            'inline_style' => '
            .wp-block-button.is-style-fill-cloud .wp-block-button__link { 
            border: 2px solid var(--wp--preset--color--cloud); 
            background-color: var(--wp--preset--color--cloud); 
            color: var(--wp--preset--color--primary); 
            } 
            .wp-block-button.is-style-fill-cloud .wp-block-button__link:hover { 
            border: 2px solid var(--wp--preset--color--yellow-green);
            background-color: var(--wp--preset--color--primary); 
            color: var(--wp--preset--color--cloud); 
            }'
        )
    );
    register_block_style(
        'core/button',
        array(
            'name'  => 'fill-primary',
            'label' => __('Fill - Primary', 'foundationpress'),
            'inline_style' => '
            .wp-block-button.is-style-fill-primary .wp-block-button__link { 
            border: 2px solid var(--wp--preset--color--primary); 
            background-color: var(--wp--preset--color--primary); 
            color: var(--wp--preset--color--cloud); 
            } 
            .wp-block-button.is-style-fill-primary .wp-block-button__link:hover { 
            border: 2px solid var(--wp--preset--color--yellow-green);
            background-color: var(--wp--preset--color--yellow-green); 
            color: var(--wp--preset--color--primary); 
            }'
        )
    );
    register_block_style(
        'core/button',
        array(
            'name'  => 'fill-yellow-green',
            'label' => __('Fill - Yellow Green', 'foundationpress'),
            'inline_style' => '
            .wp-block-button.is-style-fill-yellow-green .wp-block-button__link { 
            border: 2px solid var(--wp--preset--color--yellow-green); 
            background-color: var(--wp--preset--color--yellow-green); 
            color: var(--wp--preset--color--primary); 
            } 
            .wp-block-button.is-style-fill-yellow-green .wp-block-button__link:hover { 
            border: 2px solid var(--wp--preset--color--primary);
            background-color: var(--wp--preset--color--primary); 
            color: var(--wp--preset--color--cloud); 
            }'
        )
    );
    
    register_block_style(
        'core/button',
        array(
            'name'  => 'outline-white',
            'label' => __('Outline - White', 'foundationpress'),
            'inline_style' => '
            .wp-block-button.is-style-outline-white .wp-block-button__link { 
            background-color: transparent; 
			box-shadow: 0 0 0 2px var(--wp--preset--color--white) inset;
            color: var(--wp--preset--color--white); 
            } 
            .wp-block-button.is-style-outline-white .wp-block-button__link:hover { 
            box-shadow: 0 0 0 2px var(--wp--preset--color--yellow-green) inset;
			background-color: var(--wp--preset--color--yellow-green); 
            color: var(--wp--preset--color--primary) !important; 
            }'
        )
    );
    register_block_style(
        'core/button',
        array(
            'name'  => 'link-arrow',
            'label' => __('Link Arrow', 'foundationpress'),
            'inline_style' => '
            .wp-block-button.is-style-link-arrow .wp-block-button__link { 
            color: var(--wp--preset--color--primary); 
            border-top: none;
            border-right:none;
            border-left:none;
            padding-left:0;
            padding-right:0;
            } 
            .wp-block-button.is-style-link-arrow .wp-block-button__link:hover { 
            color: var(--wp--preset--color--yellow-green); 
            }'
        )
    );
    
}
add_action( 'init', 'my_theme_register_button_styles' );

function add_inline_svg_to_link_arrow_button( string $block_content, array $block ): string {
    if ( 'core/button' !== $block['blockName'] ) {
        return $block_content;
    }

    $className = $block['attrs']['className'] ?? '';
    if ( false === strpos( $className, 'is-style-link-arrow' ) ) {
        return $block_content;
    }

    $svg = '<svg class="link-arrow"><use xlink:href="#link-arrow"></use></svg>';

    return preg_replace_callback(
        '/(<a[^>]*class="[^"]*wp-block-button__link[^"]*"[^>]*>)(.*?)(<\/a>)/s',
        function ( $matches ) use ( $svg ) {
            $opening_tag = $matches[1];
            $content     = trim( $matches[2] );
            $closing_tag = $matches[3];

            $words = explode( ' ', $content );
            if ( count( $words ) > 1 ) {
                $last_word = array_pop( $words );
                $rest      = implode( ' ', $words );
                $wrapped   = '<span class="wp-block-button__text">' . $rest . ' <span class="wp-block-button__last-word">' . $last_word . $svg . '</span></span>';
            } else {
                $wrapped   = '<span class="wp-block-button__text"><span class="wp-block-button__last-word">' . $content . $svg . '</span></span>';
            }

            return $opening_tag . $wrapped . $closing_tag;
        },
        $block_content
    );
}
add_filter( 'render_block', 'add_inline_svg_to_link_arrow_button', 10, 2 );