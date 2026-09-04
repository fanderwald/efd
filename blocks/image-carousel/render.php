<?php 
$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['is_preview'] = $is_preview;
$context['attributes'] = preg_replace('/\s*class="[^"]*"/i', '', get_block_wrapper_attributes());

$context['is_editor'] = is_admin();

Timber::render( 'render.twig', $context );

?>