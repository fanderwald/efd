<?php 
$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['is_preview'] = $is_preview;
//$context['attributes'] = get_block_wrapper_attributes();

$classes = array_filter([
    'story-section',
    !empty($block['align']) ? 'align-' . $block['align'] : '',
    !empty($block['textColor']) ? 'has-' . $block['textColor'] . '-color' : '',
    !empty($block['backgroundColor']) ? 'has-' . $block['backgroundColor'] . '-background-color' : '',
    !empty($block['gradient']) ? 'has-' . $block['gradient'] . '-gradient' : '',
    !empty($block['className']) ? $block['className'] : '',
    !empty($context['fields']['section_bleed']) ? 'has-' . $context['fields']['section_bleed'] . '-bleed' : '',
    !empty($context['fields']['billboard_background']) ? 'has-billboard-background' : '',
]);

$context['attributes'] = get_block_wrapper_attributes([
    'class' => implode(' ', $classes),
]);

Timber::render( 'render.twig', $context );
?>