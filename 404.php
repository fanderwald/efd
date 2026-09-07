<?php
/**
 * The template for displaying 404 pages (Not Found)
 *
 * Methods for TimberHelper can be found in the /functions sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::context();
$context['theme_color'] = 'default-color';
$context['is_front_page'] = 'false';

Timber::render( '404.twig', $context );


