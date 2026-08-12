<?php
/**
 * Register custom block patterns.
 *
 * Manage block patterns via the /patterns folder.
 * 
 */

 add_action('after_setup_theme', function() {
	remove_theme_support('core-block-patterns');
});


  function rcp_patterns_register_categories() {
	register_block_pattern_category(
		'topper',
		array( 
			'label' => __( 'Toppers', 'rcp-patterns' ),
			'description' => __( 'Options for the top of pages.', 'rcp-patterns' ),
		 )
	);
	register_block_pattern_category(
		'story',
		array( 'label' => __( 'Story Content', 'rcp-patterns' ) )
	);
	register_block_pattern_category(
		'story-teaser',
		array( 'label' => __( 'Story Teasers', 'rcp-patterns' ) )
	);
	register_block_pattern_category(
		'pages',
		array( 'label' => __( 'Pages', 'rcp-patterns' ) )
	);
  }
  
  add_action( 'init', 'rcp_patterns_register_categories' );

?>