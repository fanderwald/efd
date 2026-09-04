import $ from 'jquery';
import whatInput from 'what-input';

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


