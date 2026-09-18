<?php 
$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['is_preview'] = $is_preview;
$context['attributes'] = get_block_wrapper_attributes();

$category_id = (int) ( $context['fields']['document_category'] ?? 0 );

if ( $category_id ) {
    $context['documents'] = Timber::get_posts( array(
        'post_type'      => 'board_document',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'orderby'        => 'date',
        'order'          => 'DESC',
        'tax_query'      => array(
            array(
                'taxonomy' => 'document_category',
                'field'    => 'term_id',
                'terms'    => $category_id,
            ),
        ),
    ) );
} else {
    $context['documents'] = array();
}

Timber::render( 'render.twig', $context );
?>