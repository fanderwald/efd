<?php 
$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['is_preview'] = $is_preview;
$context['attributes'] = preg_replace('/\s*class="[^"]*"/i', '', get_block_wrapper_attributes());

Timber::render( 'render.twig', $context );
?>