<?php

// Image srcset size generator

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class TwigExtensions extends AbstractExtension
{
    public function getFilters()
    {
        return [
            new TwigFilter('responsive_srcset', [$this, 'generateResponsiveSrcset']),
        ];
    }

    public function generateResponsiveSrcset($image, $sizes)
    {
        $srcset = '';
        $metadata = wp_get_attachment_metadata($image->ID);

        foreach ($sizes as $size => $width) {
            if (isset($metadata['sizes'][$size])) {
                $image_src = wp_get_attachment_image_src($image->ID, $size);
                if ($image_src && $image_src[0]) {
                    $srcset .= esc_url($image_src[0]) . ' ' . $width . ', ';
                }
            }
        }

        return trim($srcset, ', ');
    }
}



?>