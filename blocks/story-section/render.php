<?php 
$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['is_preview'] = $is_preview;

$inset_style = !empty($context['fields']['inset_style']);
$context['inset_style'] = $inset_style;

// Structural classes always live on the outer <section>.
$section_classes = array_filter([
    'story-section',
    !empty($context['fields']['section_bleed']) ? 'has-' . $context['fields']['section_bleed'] . '-bleed' : '',
    $inset_style ? 'has-inset-style' : '',
]);

// Classes driven by block/field attributes (color, spacing, align, custom class).
$style_classes = array_filter([
    !empty($block['align']) ? 'align-' . $block['align'] : '',
    !empty($block['textColor']) ? 'has-' . $block['textColor'] . '-color' : '',
    !empty($block['backgroundColor']) ? 'has-' . $block['backgroundColor'] . '-background-color' : '',
    !empty($block['gradient']) ? 'has-' . $block['gradient'] . '-gradient' : '',
    !empty($block['className']) ? $block['className'] : '',
]);

if ($inset_style) {
    // Move block/field attributes (incl. auto color/spacing styles) onto the innerblocks wrapper.
    $context['section_attributes'] = 'class="' . esc_attr(implode(' ', $section_classes)) . '"';
    $context['inner_attributes'] = get_block_wrapper_attributes([
        'class' => implode(' ', array_merge(['inset-container'], $style_classes)),
    ]);
} else {
    $context['section_attributes'] = get_block_wrapper_attributes([
        'class' => implode(' ', array_merge($section_classes, $style_classes)),
    ]);
    $context['inner_attributes'] = '';
}

Timber::render( 'render.twig', $context );
?>