import $ from 'jquery';
import whatInput from 'what-input';
import 'simplebar';

window.$ = $;

import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

$(document).foundation();


const topperContainer = document.querySelector('.topper-carousel-grid');

if (topperContainer) {
  const { initTopperCarousel } = await import('../../../blocks/topper-carousel-grid/render.js');
  initTopperCarousel(topperContainer);
}
if (document.querySelector('.impact-scroll')) {
  await import('../../../blocks/impact-scroll/render.js');
}

if (document.querySelector('.video-mp4')) {
    await import('../../../blocks/video-mp4/render.js');
}

if (document.querySelector('.image-carousel')) {
    await import('../../../blocks/image-carousel/render.js');
}

if (document.querySelector('.tabbed-content')) {
    await import('../../../blocks/tabbed-content/render.js');
}

var e = window.matchMedia("(prefers-color-scheme: dark)"),
    t = e.matches,
    i = document.querySelectorAll('link[rel="icon"]');
if ("not all" !== window.matchMedia("(prefers-color-scheme)").media) {
    var a = function(e) {
        i.forEach((function(t) {
            t.href = e ? t.dataset.hrefDark : t.dataset.hrefLight
        }))
    };
    a(t),
    e.addEventListener("change", (function(e) {
        return a(e.matches)
    }))
}

$(window).on("scroll", function() {
  if ( $(window).scrollTop() > 100 ) {
      $('header').addClass('is_stuck');
  } else {
    $('header').removeClass('is_stuck');
  }

  if ( $(window).scrollTop() <= 5 ) {
    // keep mobile menu from staying open behind a header that's no longer stuck
    $('.mobile-menu').removeClass("open");
    $('body').removeClass('nav-open');
    $('html').removeClass('no-scroll');
  }
    
});

$(".nav-toggle").on("click", function() {
	$('.mobile-menu').toggleClass("open");
  $('body').toggleClass('nav-open');
  $('html').toggleClass('no-scroll');
});

$(".mobile-menu li:not(.is-accordion-submenu-parent) a").on("click", function() {
	$('.mobile-menu').toggleClass("open");
  $('body').toggleClass('nav-open');
  $('html').toggleClass('no-scroll');
});

if (document.getElementById('category-select-js')) {
document.addEventListener('DOMContentLoaded', function() {
  const categorySelect = document.getElementById('category-select-js');
  // 1. Define the Resize Logic
  function resizeSelect(el) {
    const tempSpan = document.createElement('span');
    const style = window.getComputedStyle(el);
    
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'pre';
    tempSpan.style.font = style.font; 
    
    tempSpan.textContent = el.options[el.selectedIndex].text;
    document.body.appendChild(tempSpan);
    
    const textWidth = tempSpan.getBoundingClientRect().width;
    const paddingLeft = parseFloat(style.paddingLeft) || 0;
    const paddingRight = parseFloat(style.paddingRight) || 0;
    
    // Add an extra 30px specifically for the icon space
    const iconBuffer = 30; 
    
    el.style.width = (textWidth + paddingLeft + paddingRight + iconBuffer) + 'px';
    
    document.body.removeChild(tempSpan);
  }
      
  if (categorySelect) {
      
      resizeSelect(categorySelect);
      categorySelect.addEventListener('change', function() {
          // 3. Resize immediately so the UI looks correct before redirecting
          resizeSelect(this);

          const destination = this.value;
          if (destination) {
              window.location.href = destination;
          }
      });
  }
});
}
if (document.getElementById('clear-search')) {
  document.getElementById('clear-search').addEventListener('click', function() {
      document.getElementById('article-search-input').value = ''; // Clear the search field
      document.getElementById('article-results-container').innerHTML = '';
      //document.getElementById('search-input').focus();    // Optionally refocus the input field
  });
}
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('article-search-input');
    const resultsContainer = document.getElementById('article-results-container');

    // Debounce Utility: Waits 300ms after user stops typing to send request
    const debounce = (func, wait) => {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    };

    const performSearch = (event) => {
        const query = event.target.value;

        // Visual feedback (optional loading state)
        if(query.length > 0) {
            resultsContainer.innerHTML = '<li class="loading"><span>Searching...</span></li>';
            
            // Fetch Data
            fetch(`${articleIndexConfig.ajax_url}?action=live_search_articles&query=${query}&nonce=${articleIndexConfig.nonce}`)
            .then(response => response.text())
            .then(html => {
                resultsContainer.innerHTML = html;
            })
            .catch(error => console.error('Error:', error));
        } else {
            resultsContainer.innerHTML = ''; // Clear if empty
        }
    };

    if (searchInput) {
        // Attach the debounced function
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }
});
