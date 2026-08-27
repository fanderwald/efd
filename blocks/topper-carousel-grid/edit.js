/**
 * edit.js
 * 
 * Extends the acf/topper-split block to inject a custom FocalPointPicker interface.
 */
( function( hooks, blockEditor, components, element ) {
    var el = element.createElement;
    var InspectorControls = blockEditor.InspectorControls;
    var PanelBody = components.PanelBody;
    var FocalPointPicker = components.FocalPointPicker;
    var useEffect = element.useEffect;
    var useState = element.useState;
    var useSelect = window.wp.data.useSelect;
    var useAsync = function( callback, deps ) {
        var state = useState( { data: null, loading: true, error: null } );
        var setState = state[1];
        
        useEffect( function() {
            var isMounted = true;
            setState( { data: null, loading: true, error: null } );
            
            Promise.resolve( callback() ).then(
                function( result ) {
                    if ( isMounted ) {
                        setState( { data: result, loading: false, error: null } );
                    }
                }
            ).catch( function( err ) {
                if ( isMounted ) {
                    setState( { data: null, loading: false, error: err } );
                }
            } );

            return function() {
                isMounted = false;
            };
        }, deps );

        return state[0];
    };

    function clamp( value, min, max ) {
        return Math.min( Math.max( value, min ), max );
    }

    function getFocalPointValue( attributes ) {
        if ( attributes && attributes.focalPoint && typeof attributes.focalPoint.x === 'number' && typeof attributes.focalPoint.y === 'number' ) {
            return {
                x: clamp( attributes.focalPoint.x, 0, 1 ),
                y: clamp( attributes.focalPoint.y, 0, 1 )
            };
        }

        return { x: 0.5, y: 0.5 };
    }

    function normalizeImageId( value ) {
        if ( value && typeof value === 'object' ) {
            if ( typeof value.id === 'number' || typeof value.id === 'string' ) {
                return normalizeImageId( value.id );
            }
            if ( typeof value.ID === 'number' || typeof value.ID === 'string' ) {
                return normalizeImageId( value.ID );
            }
        }

        if ( typeof value === 'number' ) {
            return value;
        }

        if ( typeof value === 'string' && /^\d+$/.test( value ) ) {
            return parseInt( value, 10 );
        }

        return null;
    }

    function getLiveHeroField() {
        var sidebarField = document.querySelector( '.interface-interface-skeleton__sidebar .acf-field[data-name="hero_image"]:not(.acf-hidden)' );
        if ( sidebarField ) {
            return sidebarField;
        }

        return document.querySelector( '.acf-field[data-name="hero_image"]:not(.acf-hidden)' );
    }

    function getLiveDomImageId() {
        var field = getLiveHeroField();
        if ( ! field ) {
            return null;
        }

        var input = field.querySelector( 'input[type="hidden"]' );
        if ( ! input || ! input.value ) {
            return null;
        }

        return normalizeImageId( input.value );
    }

    function getLiveDomImageUrl() {
        var field = getLiveHeroField();
        if ( ! field ) {
            return '';
        }

        var imageEl = field.querySelector( '.acf-image-uploader img, .image-wrap img' );
        if ( ! imageEl ) {
            return '';
        }

        return imageEl.currentSrc || imageEl.src || '';
    }

    function resolveImageUrl( heroImage, contextImage, mediaUrl, domImageUrl ) {
        if ( contextImage && typeof contextImage === 'object' ) {
            if ( contextImage.url ) {
                return contextImage.url;
            }
            if ( contextImage.URL ) {
                return contextImage.URL;
            }
        }

        if ( heroImage && typeof heroImage === 'object' ) {
            if ( heroImage.url ) {
                return heroImage.url;
            }
            if ( heroImage.URL ) {
                return heroImage.URL;
            }
        }

        if ( typeof heroImage === 'string' && heroImage.indexOf( 'http' ) === 0 ) {
            return heroImage;
        }

        if ( domImageUrl ) {
            return domImageUrl;
        }

        return mediaUrl || '';
    }

    hooks.addFilter(
        'blocks.registerBlockType',
        'custom/topper-split-focal-point',
        function( settings, name ) {
            if ( name !== 'acf/topper-split' ) {
                return settings;
            }

            settings.attributes = Object.assign( {}, settings.attributes, {
                focalPoint: {
                    type: 'object',
                    default: { x: 0.5, y: 0.5 }
                }
            } );

            var OriginalEdit = settings.edit;

            settings.edit = function( props ) {
                var attributes = props.attributes;
                var setAttributes = props.setAttributes;
                var tickState = useState( 0 );
                var setTick = tickState[1];

                useEffect(
                    function() {
                        if ( ! props.isSelected ) {
                            return undefined;
                        }

                        var previousSignal = '';
                        var timer = setInterval( function() {
                            var nextSignal = String( getLiveDomImageId() || '' ) + '|' + String( getLiveDomImageUrl() || '' );
                            if ( nextSignal !== previousSignal ) {
                                previousSignal = nextSignal;
                                setTick( function( value ) {
                                    return value + 1;
                                } );
                            }
                        }, 250 );

                        return function() {
                            clearInterval( timer );
                        };
                    },
                    [ props.clientId, props.isSelected ]
                );

                var focalPoint = getFocalPointValue( attributes );
                var heroImage = attributes && attributes.data ? attributes.data.hero_image : null;
                var contextImage = props.context && props.context['acf/fields'] ? props.context['acf/fields'].hero_image : null;
                var domImageId = getLiveDomImageId();
                var domImageUrl = getLiveDomImageUrl();
                var imageId = normalizeImageId( contextImage ) || normalizeImageId( heroImage ) || domImageId;
                
                var mediaUrl = useSelect(
                    function( select ) {
                        if ( ! imageId ) {
                            return '';
                        }
                        var media = select( 'core' ).getMedia( imageId );
                        return media && media.source_url ? media.source_url : '';
                    },
                    [ imageId ]
                );

                var restMediaUrl = useAsync(
                    function() {
                        if ( ! imageId || mediaUrl ) {
                            return Promise.resolve( '' );
                        }
                        return fetch( '/wp-json/wp/v2/media/' + imageId )
                            .then( function( res ) {
                                if ( ! res.ok ) return '';
                                return res.json();
                            } )
                            .then( function( media ) {
                                return ( media && media.source_url ) ? media.source_url : '';
                            } )
                            .catch( function() {
                                return '';
                            } );
                    },
                    [ imageId, mediaUrl ]
                );

                var imageUrl = ( mediaUrl || restMediaUrl.data ) ? resolveImageUrl( heroImage, contextImage, mediaUrl || restMediaUrl.data, domImageUrl ) : '';
                var isValidImageUrl = imageUrl && typeof imageUrl === 'string' && ( imageUrl.indexOf( 'http://' ) === 0 || imageUrl.indexOf( 'https://' ) === 0 );

                return el(
                    element.Fragment,
                    null,
                    el( InspectorControls, null,
                        el( PanelBody, { title: 'Image Focal Point', initialOpen: true },
                            isValidImageUrl ? el( FocalPointPicker, {
                                url: imageUrl,
                                value: focalPoint,
                                onChange: function( value ) {
                                    setAttributes( {
                                        focalPoint: {
                                            x: clamp( value.x, 0, 1 ),
                                            y: clamp( value.y, 0, 1 )
                                        }
                                    } );
                                }
                            } ) : el( 'p', { style: { fontStyle: 'italic', color: '#757575' } }, 'Please assign an image to the Hero Image field in the block options to enable layout focal tracking.' )
                        )
                    ),
                    OriginalEdit ? el( OriginalEdit, props ) : null
                );
            };

            return settings;
        }
    );
} )( window.wp.hooks, window.wp.blockEditor, window.wp.components, window.wp.element );