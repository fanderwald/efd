

    $('.tabbed-content .tabbed-content-story:first-child').addClass('selected');

    // Preload images in hidden tabs to prevent flash when switching
    $('.tabbed-content-group').each(function() {
      var $group = $(this);
      $group.find('.tabbed-content-story img').each(function() {
        var $img = $(this);
        if ($img.attr('data-src')) {
          // Handle lazy loading plugins
          $img.attr('src', $img.attr('data-src'));
        }
        // Force eager loading
        $img.attr('loading', 'eager');
      });
    });

    $('.tabbed-content-nav li a').on('click', function (e) {
      e.preventDefault();

      var $this = $(this);
      var $tabbedContentGroup = $this.closest('.tabbed-content-group');

      $tabbedContentGroup.find('.tabbed-content-nav li a').removeClass('is-active');
      $this.addClass('is-active');

      var tabID = $this.data('category');

      $tabbedContentGroup.find('.tabbed-content-story').removeClass('selected');
      $tabbedContentGroup.find('#' + tabID).addClass('selected');

      // Scroll to top of the tabbed content group when switching tabs
      if ($tabbedContentGroup.length > 0) {
        var groupOffset = $tabbedContentGroup.offset().top;
        var stickyOffset = 32; // Account for some padding from top
        
        $('html, body').animate({
          scrollTop: Math.max(0, groupOffset - stickyOffset)
        }, 300);
      }

      // Sync select with tab click (for consistency on mobile)
      $tabbedContentGroup.find('.content-nav-select').val(tabID);
    });

    // Handle mobile select
    $('.content-nav-select').on('change', function () {
      var $this = $(this);
      var tabID = $this.val();
      var $tabbedContentGroup = $this.closest('.tabbed-content-group');

      // Update the visible tab content
      $tabbedContentGroup.find('.tabbed-content-story').removeClass('selected');
      $tabbedContentGroup.find('#' + tabID).addClass('selected');

      // Scroll to top of the tabbed content group when switching tabs
      if ($tabbedContentGroup.length > 0) {
        var groupOffset = $tabbedContentGroup.offset().top;
        var stickyOffset = 32; // Account for some padding from top
        
        $('html, body').animate({
          scrollTop: Math.max(0, groupOffset - stickyOffset)
        }, 300);
      }

      // Sync nav links (optional but nice if switching back to desktop)
      $tabbedContentGroup.find('.tabbed-content-nav li a').removeClass('is-active');
      $tabbedContentGroup.find('.tabbed-content-nav li a[data-category="' + tabID + '"]').addClass('is-active');
    });

