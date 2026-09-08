<?php
/**
 * The Template for displaying all single posts
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context         = Timber::context();
$timber_post     = Timber::get_post();
$context['post'] = $timber_post;
$context['news'] = Timber::get_post(25);
$context['people'] = Timber::get_post(3836);
$context['color_theme'] = 'light';
$context['posts'] = Timber::get_posts([
	'post_type' => 'post', 
	'posts_per_page' => 12,
]);
$posts_page_id = get_option('page_for_posts');
if ($posts_page_id) {
    $context['posts_page'] = Timber::get_post($posts_page_id);
}

// Fetch the 3 most recent posts for the sidebar
$context['latest_posts'] = Timber::get_posts([
    'post_type'           => 'post',
    'posts_per_page'      => 5,
    'ignore_sticky_posts' => true, // Good practice for sidebars
    'post_status'         => 'publish',
    // Optional: Exclude the current post being viewed
    'post__not_in'        => [$context['post']->ID], 
]);

ob_start();
dynamic_sidebar('sidebar-1');
$context['sidebar_widgets'] = ob_get_clean();

$context['is_preview'] = isset($is_preview) && $is_preview;




if ( post_password_required( $timber_post->ID ) ) {
	Timber::render( 'single-password.twig', $context );
} else {
	Timber::render( array( 'single-' . $timber_post->ID . '.twig', 'single-' . $timber_post->post_type . '.twig', 'single-' . $timber_post->slug . '.twig', 'single.twig' ), $context );
}
