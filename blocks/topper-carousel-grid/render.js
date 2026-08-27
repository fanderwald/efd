import Swiper from 'swiper/bundle';

export function initTopperCarousel(container) {
  if (!container) return;

  const swiperElement = container.querySelector('.topper-carousel-swiper');
  if (!swiperElement) return;

  const prevBtn = container.querySelector('.swiper-button-prev');
  const nextBtn = container.querySelector('.swiper-button-next');

  const captionCard = container.querySelector('.topper-grid__caption-card');
  const titleEl = captionCard?.querySelector('.caption-title');
  const bodyEl = captionCard?.querySelector('.caption-body');
  const linkEl = captionCard?.querySelector('.caption-link');

  // Helper to safely parse and swap slide captions
  const updateCaption = (swiperInstance) => {
    if (!captionCard) return;

    const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
    if (!activeSlide) return;

    const rawData = activeSlide.getAttribute('data-caption');
    if (!rawData) return;

    try {
      const data = JSON.parse(rawData);

      if (titleEl) titleEl.textContent = data.title || '';
      if (bodyEl) bodyEl.textContent = data.body || '';

      if (linkEl) {
        if (data.url) {
          linkEl.href = data.url;
          linkEl.textContent = `${data.text || 'Read Story'}`;
          linkEl.style.display = 'inline-block';
        } else {
          linkEl.style.display = 'none';
        }
      }
    } catch (err) {
      // Catch parse error silently so Swiper engine remains active
    }
  };

  const autoplaySpeedRaw = swiperElement.getAttribute("data-autoplay-speed");
  const autoplayEnabled = swiperElement.getAttribute("data-autoplay") === "true";
  const parsedSpeed = parseInt(autoplaySpeedRaw, 10) || 5000;

  new Swiper(swiperElement, {
    centeredSlides: false,
    autoHeight: false,
    allowTouchMove: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    autoplay: autoplayEnabled
      ? {
          delay: parsedSpeed,
          disableOnInteraction: false,
        }
      : false,
    loop: true,
    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },
    on: {
      init: function () {
        updateCaption(this);
      },
      slideChange: function () {
        updateCaption(this);
      },
    },
  });
}