import Swiper from 'swiper/bundle';
function initImageSwipers(scope = document) {
  scope.querySelectorAll('.image-div__swiper').forEach((el) => {
    if (el.swiper) return; // prevent re-initialization

    const delay = parseInt(el.dataset.swiperAutoplay, 10) || 5000;

    new Swiper(el, {
      slidesPerView: 1,
      speed: 500,
      loop: false,
      grabCursor: true,
      navigation: {
        nextEl: el.querySelector('.swiper-button-next'),
        prevEl: el.querySelector('.swiper-button-prev'),
      },
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        dynamicBullets: true,
        clickable: true
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