<?php
/**
 * Vite integration helper for WordPress theme
 *
 * Handles manifest parsing, asset URL resolution, and script/style loading
 * for both Vite dev server (with HMR) and production builds.
 */

namespace FoundationPress\Vite;

/**
 * Check if current WordPress request is over HTTPS.
 */
function is_ssl() {
	if ( ! empty( $_SERVER['HTTPS'] ) && 'off' !== strtolower( $_SERVER['HTTPS'] ) ) {
		return true;
	}
	if ( ! empty( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && 'https' === strtolower( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) ) {
		return true;
	}
	if ( ! empty( $_SERVER['HTTP_X_FORWARDED_SSL'] ) && 'on' === strtolower( $_SERVER['HTTP_X_FORWARDED_SSL'] ) ) {
		return true;
	}
	if ( function_exists( '\is_ssl' ) ) {
		return \is_ssl();
	}
	return false;
}

/**
 * Get the Vite dev server origin. Dynamically resolves to the hostname
 * and scheme (http vs https) accessing WordPress so LAN devices, tunnels,
 * and local browser tabs connect directly to Vite or BrowserSync proxy.
 */

function get_vite_host() {
    $scheme = is_ssl() ? 'https' : 'http';

    // If accessed through BrowserSync proxy (e.g. 192.168.1.165:3000 or localhost:3000)
    if ( ! empty( $_SERVER['HTTP_X_BS_HOST'] ) ) {
        return $scheme . '://' . $_SERVER['HTTP_X_BS_HOST'];
    }

    $host = 'localhost';

    // Check marker file if Vite specified https explicitly
    $marker_file = get_template_directory() . '/dist/.vite-dev';
    if ( file_exists( $marker_file ) ) {
        $info = json_decode( file_get_contents( $marker_file ), true );
        if ( ! empty( $info['https'] ) ) {
            $scheme = 'https';
        }
    }

    if ( ! empty( $_SERVER['HTTP_HOST'] ) ) {
        $parsed = parse_url( 'http://' . $_SERVER['HTTP_HOST'], PHP_URL_HOST );
        // If accessed via a LAN IP (e.g. 192.168.x.x), point assets to that IP.
        if ( ! empty( $parsed ) && filter_var( $parsed, FILTER_VALIDATE_IP ) ) {
            $host = $parsed;
        }
    }
    return $scheme . '://' . $host . ':5173';
}

const ENTRY_SCRIPTS = array( 'src/assets/js/app.js' );

/**
 * Check if Vite development server is currently running.
 * Uses a marker file (.vite-dev) written to dist during server startup,
 * with fallback port ping check to ensure zero-lag transitions.
 */
function is_dev() {
	static $is_dev = null;
	if ( null !== $is_dev ) {
		return $is_dev;
	}

	$theme_dir   = get_template_directory();
	$marker_file = $theme_dir . '/dist/.vite-dev';

	if ( file_exists( $marker_file ) ) {
		// Fast check: verify port is actually answering
		$handle = @fsockopen( 'localhost', 5173, $errno, $errstr, 0.05 );
		if ( is_resource( $handle ) ) {
			fclose( $handle );
			$is_dev = true;
			return true;
		}
	}

	$is_dev = false;
	return false;
}

/**
 * Retrieve Vite production manifest data.
 */
function get_manifest() {
    static $manifest = null;
    if ( null !== $manifest ) {
        return $manifest;
    }

    $theme_dir = get_template_directory();
    // Check standard dist/manifest.json first, fallback to .vite/manifest.json
    $manifest_path = $theme_dir . '/dist/manifest.json';
    if ( ! file_exists( $manifest_path ) ) {
        $manifest_path = $theme_dir . '/dist/.vite/manifest.json';
    }

    if ( file_exists( $manifest_path ) ) {
        $manifest = json_decode( file_get_contents( $manifest_path ), true );
    } else {
        $manifest = array();
    }

    return $manifest;
}

/**
 * Get the public URL for an asset entry in dev or prod.
 *
 * @param string $entry Path relative to theme root, e.g. 'src/assets/js/app.js'
 * @return string Full URL to asset
 */
function asset_url( $entry ) {
	if ( is_dev() ) {
		return get_vite_host() . '/' . ltrim( $entry, '/' );
	}

	$manifest = get_manifest();
	$entry_key = ltrim( $entry, '/' );

	if ( isset( $manifest[ $entry_key ]['file'] ) ) {
		return get_template_directory_uri() . '/dist/' . $manifest[ $entry_key ]['file'];
	}

	return '';
}

/**
 * Get CSS files associated with an entrypoint in production.
 *
 * @param string $entry Path relative to theme root
 * @return array List of CSS URLs
 */
function get_entry_css( $entry ) {
	if ( is_dev() ) {
		return array();
	}

	$manifest  = get_manifest();
	$entry_key = ltrim( $entry, '/' );
	$css_urls  = array();

	if ( isset( $manifest[ $entry_key ]['css'] ) && is_array( $manifest[ $entry_key ]['css'] ) ) {
		foreach ( $manifest[ $entry_key ]['css'] as $css_file ) {
			$css_urls[] = get_template_directory_uri() . '/dist/' . $css_file;
		}
	}

	return $css_urls;
}

/**
 * Filter script tags to add type="module" and crossorigin attributes for Vite-enqueued scripts.
 */
if ( function_exists( 'add_filter' ) ) {
	add_filter( 'script_loader_tag', function( $tag, $handle, $src ) {
		if ( strpos( $handle, 'vite-' ) === 0 || $handle === 'foundation' ) {
			// Replace standard script type with module
			if ( strpos( $tag, 'type="module"' ) === false ) {
				$tag = preg_replace( '/^<script\s+/', '<script type="module" crossorigin ', $tag );
			}
		}
		return $tag;
	}, 10, 3 );
}
