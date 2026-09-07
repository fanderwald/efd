( function( plugins, editPost, components, element, data ) {
    var el = element.createElement;
    var PluginDocumentSettingPanel = editPost.PluginDocumentSettingPanel;
    var FocalPointPicker = components.FocalPointPicker;
    var useSelect = data.useSelect;
    var useDispatch = data.useDispatch;

    function clamp( value ) {
        return Math.min( Math.max( value, 0 ), 1 );
    }

    function getFocalPointValue( value ) {
        if ( typeof value === 'string' ) {
            try {
                value = JSON.parse( value );
            } catch ( error ) {
                value = null;
            }
        }

        if ( value && typeof value.x === 'number' && typeof value.y === 'number' ) {
            return {
                x: clamp( value.x ),
                y: clamp( value.y )
            };
        }

        return { x: 0.5, y: 0.5 };
    }

    function PersonFocalPointPanel() {
        var postType = useSelect( function( select ) {
            return select( 'core/editor' ).getCurrentPostType();
        }, [] );
        var featuredMediaId = useSelect( function( select ) {
            return select( 'core/editor' ).getEditedPostAttribute( 'featured_media' );
        }, [] );
        var focalPoint = useSelect( function( select ) {
            var meta = select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {};
            return getFocalPointValue( meta.person_focal_point );
        }, [] );
        var imageUrl = useSelect( function( select ) {
            if ( ! featuredMediaId ) {
                return '';
            }

            var media = select( 'core' ).getMedia( featuredMediaId );
            return media && media.source_url ? media.source_url : '';
        }, [ featuredMediaId ] );
        var editPost = useDispatch( 'core/editor' ).editPost;

        if ( postType !== 'people' ) {
            return null;
        }

        return el(
            PluginDocumentSettingPanel,
            { name: 'person-focal-point', title: 'Portrait Focal Point' },
            imageUrl ? el( FocalPointPicker, {
                url: imageUrl,
                value: focalPoint,
                onChange: function( value ) {
                    editPost( {
                        meta: {
                            person_focal_point: JSON.stringify( {
                                x: clamp( value.x ),
                                y: clamp( value.y )
                            } )
                        }
                    } );
                }
            } ) : el( 'p', null, 'Set a featured image to adjust its focal point.' )
        );
    }

    plugins.registerPlugin( 'person-focal-point', {
        render: PersonFocalPointPanel
    } );
} )( window.wp.plugins, window.wp.editPost, window.wp.components, window.wp.element, window.wp.data );
