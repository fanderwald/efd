<?php 

$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['is_preview'] = $is_preview;

$classes = array_filter([
    'call-to-action',
    !empty($block['align']) ? 'align-' . $block['align'] : '',
    !empty($block['textColor']) ? 'has-' . $block['textColor'] . '-color' : '',
    !empty($block['backgroundColor']) ? 'has-' . $block['backgroundColor'] . '-background-color' : '',
    !empty($block['gradient']) ? 'has-' . $block['gradient'] . '-gradient-background' : '',
    !empty($block['className']) ? $block['className'] : '',
    !empty($context['fields']['cta_image']) ? 'has-image' : '',
]);

$context['attributes'] = get_block_wrapper_attributes([
    'class' => implode(' ', $classes),
]);

Timber::render( 'render.twig', $context );
?>