<?php
/*
Template Name: Guided Page
*/

$context = Timber::context();

$timber_post     = Timber::get_post();
$context['post'] = $timber_post;
$context['topper_heading'] = get_field('page_guide_heading');
$context['topper_content'] = get_field('page_guide_content');
$context['context_nav_heading'] = get_field('context_nav_heading');
$context['context_nav'] = get_field('context_nav');
$context['color_theme'] = get_field('color_theme');


Timber::render( 'page_guide_tpl.twig', $context );