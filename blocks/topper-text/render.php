<?php 
$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['focal_point'] = get_field('focal_point') ?: 'center center';
$context['is_preview'] = $is_preview;
$context['attributes'] = get_block_wrapper_attributes();

$landscape = get_field('hero_image');
$portrait  = get_field('hero_image_mobile');
$context['landscape_image'] = $landscape;
$context['portrait_image']  = $portrait ?: $landscape;



Timber::render( 'render.twig', $context );
?>