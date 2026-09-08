<?php
/**
 * The main template file
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.1
 */

$context          = Timber::context();
$context['term_page'] = Timber::get_term();
$context['news'] = Timber::get_post(13);
$context['color_theme'] = 'light';
$context['categories'] = Timber::get_terms([
    'taxonomy' => 'category',
    'hide_empty' => false,
]);



$templates        = array( 'archive.twig' );

Timber::render( $templates, $context );