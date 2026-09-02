<?php 
$template = array(
    array('core/heading', array(
        'level' => 2,
        'content' => 'This is a default heading',
    )),
    array('core/group', array(
        'layout' => array(
            'type' => 'constrained',
            'contentSize' => '100%',
            'wideSize' => '100%',
        ),
    ), array(
        array( 'core/paragraph', array(
            'content' => 'This is placeholder paragraph text.',
        )),
    ))
);
$context = Timber::context();
$context['block'] = $block;
$context['fields'] = get_fields();
$context['is_preview'] = $is_preview;
$context['template'] = esc_attr( wp_json_encode( $template ));

Timber::render( 'render.twig', $context );
?>