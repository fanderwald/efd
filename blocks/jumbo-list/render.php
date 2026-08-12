<?php 

$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['is_preview'] = $is_preview;

Timber::render( 'render.twig', $context );
?>