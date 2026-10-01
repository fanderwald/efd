<?php
/**
 * Render Registered Block List block
 *
 * @var array $block The block settings and attributes.
 * @var string $content The block inner HTML (empty).
 * @var bool $is_preview True during backend preview render.
 * @var int $post_id The post ID the block is rendering on.
 */

$context = Timber::context();
$context['block']      = $block;
$context['fields']     = get_fields();
$context['is_preview'] = $is_preview;

$registry = WP_Block_Type_Registry::get_instance();
$all_registered_blocks = $registry->get_all_registered();

$blocks_list = [];

foreach ( $all_registered_blocks as $key => $registered_block ) {
    $name = is_object( $registered_block ) ? $registered_block->name : ( $registered_block['name'] ?? $key );
    $category = is_object( $registered_block ) ? ( $registered_block->category ?? '' ) : ( $registered_block['category'] ?? '' );
    
    // Skip this documentation block itself
    if ( $name === 'acf/registered-block-list' ) {
        continue;
    }

    // Include custom theme blocks (prefixed with 'acf/' or categorized under 'custom-blocks')
    $is_custom = str_starts_with( $name, 'acf/' ) || $category === 'custom-blocks';
    if ( ! $is_custom ) {
        continue;
    }

    $title = is_object( $registered_block ) ? $registered_block->title : ( $registered_block['title'] ?? '' );
    $description = is_object( $registered_block ) ? $registered_block->description : ( $registered_block['description'] ?? '' );

    $blocks_list[] = [
        'name'        => $name,
        'title'       => ! empty( $title ) ? $title : $name,
        'description' => ! empty( $description ) ? $description : '',
        'category'    => $category,
    ];
}

// Sort alphabetically by block title
usort( $blocks_list, function( $a, $b ) {
    return strcasecmp( $a['title'], $b['title'] );
} );

$context['blocks_list'] = $blocks_list;

$classes = array_filter( [
    'registered-block-list',
    ! empty( $block['align'] ) ? 'align-' . $block['align'] : '',
    ! empty( $block['textColor'] ) ? 'has-' . $block['textColor'] . '-color' : '',
    ! empty( $block['backgroundColor'] ) ? 'has-' . $block['backgroundColor'] . '-background-color' : '',
    ! empty( $block['className'] ) ? $block['className'] : '',
] );

$context['attributes'] = get_block_wrapper_attributes( [
    'class' => implode( ' ', $classes ),
] );

Timber::render( 'render.twig', $context );
