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
    register_block_type( __DIR__ . '/../blocks/story' );
    register_block_type( __DIR__ . '/../blocks/info-card' );
    register_block_type( __DIR__ . '/../blocks/jumbo-list' );
    register_block_type( __DIR__ . '/../blocks/story-grid' );
	register_block_type( __DIR__ . '/../blocks/story-section' );
    register_block_type( __DIR__ . '/../blocks/topper-carousel-content' );
    register_block_type( __DIR__ . '/../blocks/topper-carousel-leader' );
    register_block_type( __DIR__ . '/../blocks/topper-carousel-grid' );
    register_block_type( __DIR__ . '/../blocks/topper-cover' );
    register_block_type( __DIR__ . '/../blocks/topper-split' );
}
function pel_split_quote_cite( $block_content, $block ) {
    if ( false === strpos( $block_content, '<cite' ) ) {
        return $block_content;
    }

    return preg_replace_callback(
        '/<cite[^>]*>(.*?)<\/cite>/is',
        function ( $matches ) {
            $raw = wp_strip_all_tags( html_entity_decode( $matches[1], ENT_QUOTES | ENT_HTML5 ) );
            $parts = array_map( 'trim', explode( '|', $raw, 2 ) );

            $name = $parts[0] ?? '';
            $role = $parts[1] ?? '';

            $html  = '<cite class="quote-cite">';
            if ( $name !== '' ) {
                $html .= '<span class="quote-cite-name">' . esc_html( $name ) . '</span>';
            }
            if ( $role !== '' ) {
                $html .= '<span class="quote-cite-role">' . esc_html( $role ) . '</span>';
            }
            $html .= '</cite>';

            return $html;
        },
        $block_content
    );
}
add_filter( 'render_block_core/quote', 'pel_split_quote_cite', 10, 2 );
?>