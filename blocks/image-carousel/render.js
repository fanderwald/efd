import Swiper from 'swiper/bundle';
function initImageSwipers(scope = document) {
  scope.querySelectorAll('.image-carousel-swiper').forEach((el) => {
    if (el.swiper) return; // prevent re-initialization

    const delay = parseInt(el.dataset.swiperAutoplay, 10) || 5000;
    const autoplayEnabled = el.getAttribute("data-autoplay") === "true";
    new Swiper(el, {
      speed: 500,
      loop: true,
      grabCursor: true,
      roundLengths: true,
      watchSlidesProgress: true,
      watchOverflow: true,
      updateOnImagesReady: true,
      observer: true,
      observeParents: true,
      autoplay: autoplayEnabled ? {
        delay: delay,
      } : false,
      navigation: {
        nextEl: el.querySelector('.swiper-button-next'),
        prevEl: el.querySelector('.swiper-button-prev'),
      }
    });
  });
}


initImageSwipers();
// Observe dynamic block additions in Gutenberg editor
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        initImageSwipers(node);
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});