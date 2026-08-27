<?php
return array(
    'dependencies' => array(
        'wp-block-editor',
        'wp-blocks',
        'wp-components',
        'wp-data',
        'wp-element',
        'wp-hooks',
    ),
    'version' => file_exists( __DIR__ . '/edit.js' ) ? (string) filemtime( __DIR__ . '/edit.js' ) : '1.0.0',
);
