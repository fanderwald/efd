<?php
/**
 * Theme functions and definitions
 */

require_once(__DIR__ . '/vendor/autoload.php');

Timber\Timber::init();

require_once( 'library/foundation.php' );
require_once( 'library/navigation.php' );
require_once( 'library/enqueue-scripts.php' );
require_once( 'library/theme-support.php' );
require_once( 'library/responsive-images.php' );
require_once( 'library/custom-blocks.php' );
//require_once( 'library/block-patterns.php' );
require_once( 'library/twig-extensions.php' );

function clean_up_wp_head() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);
    remove_action('wp_head', 'rest_output_link_wp_head', 10);
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
    remove_action('wp_head', 'wp_oembed_add_host_js');
    remove_action('wp_head', 'wp_resource_hints', 2);
}
add_action('init', 'clean_up_wp_head');



add_filter('timber/twig', 'add_to_twig');

function add_to_twig($twig){
    $twig->addExtension(new TwigExtensions());
    return $twig;
}

function setup_acf_options_page() {
    if( function_exists('acf_add_options_page') ) {
        acf_add_options_page(
            array(
                'page_title'    => 'Site Settings'
            )
        );
    }
}
add_action('init', 'setup_acf_options_page');

function my_login_logo_one() { 
	?> 
	<style type="text/css"> 
	body.login div#login h1 a {
	background-image: url(<?php echo site_url();?>/wp-content/uploads/2026/07/rp-primary-logo.svg);
	background-size:contain;
	width:300px;
	height:100px;
	} 
	</style>
	 <?php 
	} add_action( 'login_enqueue_scripts', 'my_login_logo_one' );


// Move Yoast to bottom
function yoasttobottom() {
	return 'low';
}
add_filter( 'wpseo_metabox_prio', 'yoasttobottom');

add_filter( 'timber/context', 'add_to_context' );

function add_to_context( $context ) {
	$context['current_url'] = Timber\URLHelper::get_current_url();
	$context['menu'] = Timber::get_menu( 'Primary Menu' );
    $context['legal'] = Timber::get_menu( 'Legal Menu' );
    $context['top_menu'] = Timber::get_menu( 'Top Menu' );
	$context['global'] = get_fields('option');

    return $context;
}

/**
 * Templates and Page IDs without editor
 *
 */
function ea_disable_editor( $id = false ) {

	$excluded_templates = array(
		//'page-templates/home.php'
	);

	$excluded_ids = array( '33');
	

	if( empty( $id ) )
		return false;

	$id = intval( $id );
	$template = get_page_template_slug( $id );

	return in_array( $id, $excluded_ids ) || in_array( $template, $excluded_templates );
}


function load_svg_sprite() {
    echo '<svg display="none" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
            <symbol id="link-arrow" viewBox="0 0 20 15">
                <g transform="translate(-226.000000, -12.000000)" fill-rule="nonzero">
                    <polygon id="large-link-arrow" points="238.316134 12 245.041862 18.322854 245.087488 18.3229895 245.087488 18.3652954 246 19.2239826 245.086575 20.0819114 245.087251 20.1270617 245.038212 20.1270617 238.316141 26.4481098 236.874878 24.8734103 241.922896 20.1270617 226 20.1251203 226.000237 18.321048 241.925633 18.322854 236.874878 13.5747175" fill="currentColor"></polygon>
                </g>
            </symbol>
            <symbol id="link-arrow-back" viewBox="0 0 20 15">
                <g fill="000000" fill-rule="nonzero">
                    <polygon id="large-link-arrow" transform="translate(10, 7.2241) scale(-1, 1) translate(-10, -7.2241)" points="12.3161336 -3.55271368e-14 19.0418622 6.32285404 19.0874878 6.32298949 19.0874878 6.36529536 20 7.22398264 19.0865753 8.0819114 19.0872506 8.12706174 19.0382121 8.12706174 12.3161409 14.4481098 10.874878 12.8734103 15.9228955 8.12706174 1.17103931e-13 8.12512028 0.000237253171 6.32104802 15.925633 6.32285404 10.874878 1.57471754"></polygon>
                </g>
            </symbol>
            <symbol id="swiper-arrow" viewBox="0 0 40 40">
                <path d="M20,0 C31.045695,0 40,8.954305 40,20 C40,31.045695 31.045695,40 20,40 C8.954305,40 0,31.045695 0,20 C0,8.954305 8.954305,0 20,0 Z M20,1 C9.50658975,1 1,9.50658975 1,20 C1,30.4934102 9.50658975,39 20,39 C30.4934102,39 39,30.4934102 39,20 C39,9.50658975 30.4934102,1 20,1 Z M22.3161336,13 L29.0418622,19.322854 L29.0874878,19.3229895 L29.0874878,19.3652954 L30,20.2239826 L29.0865753,21.0819114 L29.0872506,21.1270617 L29.0382121,21.1270617 L22.3161409,27.4481098 L20.874878,25.8734103 L25.9228955,21.1270617 L10,21.1251203 L10.0002373,19.321048 L25.925633,19.322854 L20.874878,14.5747175 L22.3161336,13 Z" fill="currentColor" fill-rule="nonzero"></path>
            </symbol>
            <symbol id="menu-dropdown-arrow" viewBox="0 0 15 9">
                <path id="Arrow_Down" data-name="Arrow Down" d="M712.479,1054.252l-7.494-6.748,2.008-2.229,5.533,4.982,5.825-5.005,1.955,2.275Z" transform="translate(-704.985 -1045.251)" fill="currentColor"/>
            </symbol>
        </defs>   
    </svg>';
}
add_action('wp_body_open', 'load_svg_sprite');
add_action('admin_footer', 'load_svg_sprite');

function local_fontawesome() {
    wp_enqueue_style('font-awesome', get_template_directory_uri() . '/fontawesome-kit-e0bf342f83/css/all.min.css', array(), '6.5.1');
}
add_action('wp_enqueue_scripts', 'local_fontawesome');



