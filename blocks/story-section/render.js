// Check block exists on the page
if (document.querySelector('.story-section')) {

 // Function to toggle 'theme-light' and 'theme-dark' classes on body
// Function to toggle 'theme-light' and 'theme-dark' classes on body
function toggleThemeOnScroll() {
  const lightTrigger = document.querySelector('.theme-light');  // Trigger for light theme
  const darkTrigger = document.querySelector('.theme-dark');    // Trigger for dark theme
  const body = document.body;

  // Observer for when the .theme-light div enters and exits the viewport
  const lightObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // If .theme-light div enters the viewport, add theme-light and remove theme-dark
        body.classList.add('theme-light');
        body.classList.remove('theme-dark');
      } else {
        // If .theme-light div exits the viewport, remove theme-light
        body.classList.remove('theme-light');
      }
    });
  }, {
    threshold: 0, // Trigger as soon as any part of the .theme-light element enters or exits the viewport
  });

  // Observer for when the .theme-dark div enters and exits the viewport
  const darkObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // If .theme-dark div enters the viewport, add theme-dark and remove theme-light
        body.classList.add('theme-dark');
        body.classList.remove('theme-light');
      } else {
        // If .theme-dark div exits the viewport, remove theme-dark
        body.classList.remove('theme-dark');
      }
    });
  }, {
    threshold: 0, // Trigger as soon as any part of the .theme-dark element enters or exits the viewport
  });

  // Start observing the target elements
  if (lightTrigger) {
    lightObserver.observe(lightTrigger);
  }
  if (darkTrigger) {
    darkObserver.observe(darkTrigger);
  }

  // Ensure that the theme-light class is correctly applied when scrolling back up
  // When scrolling up, the darkObserver might still be keeping theme-dark, so manually check the light trigger
  window.addEventListener('scroll', () => {
    if (body.classList.contains('theme-dark') && lightTrigger) {
      const rect = lightTrigger.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        body.classList.add('theme-light');
        body.classList.remove('theme-dark');
      }
    }
  });
}

// Initialize the function when the page loads
document.addEventListener('DOMContentLoaded', toggleThemeOnScroll);




}