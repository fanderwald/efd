import $ from 'jquery';
import whatInput from 'what-input';
//import slick from 'slick-carousel';
//import inview from 'in-view';
//import FontFaceObserver from 'fontfaceobserver';

window.$ = $;

import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

$(document).foundation();


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
  if ( $(window).scrollTop() > 50 ) {
      $('header').addClass('is_stuck');
  } else {
    $('header').removeClass('is_stuck');
  }
    
});


$(".nav-toggle").on("click", function() {
  $('body').toggleClass('nav-open');
});

$(".mobile-menu li:not(.is-accordion-submenu-parent) a").on("click", function() {
	$('.mobile-menu').toggleClass("open");
  $('body').toggleClass('nav-open');
});


const container = document.getElementById('expanding-pill-container');
const toggleButton = document.getElementById('pill-toggle-button');

if (container && toggleButton) {
  const updateExpandedState = () => {
    const isExpanded = container.classList.contains('active');
    toggleButton.setAttribute('aria-expanded', isExpanded);
    document.body.classList.toggle('nav-open', isExpanded);
  };

  const closePill = () => {
    if (!container.classList.contains('active')) {
      return;
    }

    container.classList.remove('active');
    updateExpandedState();
  };

  toggleButton.addEventListener('click', () => {
    container.classList.toggle('active');
    updateExpandedState();
  });

  document.addEventListener('click', (event) => {
    if (!container.contains(event.target)) {
      closePill();
    }
  });

  container.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closePill();
    }
  });
}






