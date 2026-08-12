<?php 
$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['is_preview'] = $is_preview;

$block_gap = $block['style']['spacing']['blockGap'] ?? '0';

if (str_starts_with($block_gap, 'var:preset|spacing|')) {
    $block_gap = str_replace('var:preset|spacing|', 'var(--wp--preset--spacing--', $block_gap) . ')';
}

$styles = [
    '--wp--style--block-gap:' . $block_gap . ';'
];

$context['attributes'] = get_block_wrapper_attributes([
    'style' => implode(' ', $styles),
]);

Timber::render( 'render.twig', $context );
?>