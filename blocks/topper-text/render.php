<?php 
$template = array(
    array(
        'acf/story-grid',
        array(
            'className' => 'two-wide-grid',
        ),
        array(
            array(
                'acf/story',
                array(
                    'className' => 'has-default-bleed has-default-width',
                ),
                array(
                    array(
                        'core/heading',
                        array(
                            'level' => 1,
                            'content' => 'Heading',
                            'textColor' => 'primary',
                            'fontSize' => 'fluid-36-65',
                            'style' => array(
                                'elements' => array(
                                    'link' => array(
                                        'color' => array(
                                            'text' => 'var:preset|color|primary',
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
            array(
                'acf/story',
                array(
                    'className' => 'has-default-bleed has-default-width',
                ),
                array(
                    array(
                        'core/paragraph',
                        array(
                            'content' => 'Optional extra text for the story block.',
                        ),
                    ),
                ),
            ),
        ),
    ),
);
$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['template'] = esc_attr( wp_json_encode( $template ));
$context['focal_point'] = get_field('focal_point') ?: 'center center';
$context['is_preview'] = $is_preview;
$context['attributes'] = get_block_wrapper_attributes();

$landscape = get_field('hero_image');
$portrait  = get_field('hero_image_mobile');
$context['landscape_image'] = $landscape;
$context['portrait_image']  = $portrait ?: $landscape;



Timber::render( 'render.twig', $context );
?>