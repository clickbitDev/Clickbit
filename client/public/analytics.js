// Google Analytics (GA4) - External file to avoid CSP inline script issues
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-G2SP59398M');

// Custom event tracking for key business interactions
function trackEvent(eventName, parameters = {}) {
  gtag('event', eventName, parameters);
}

// Track form submissions
document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function() {
      trackEvent('form_submit', {
        form_name: form.getAttribute('data-form-name') || 'contact_form',
        page_location: window.location.pathname
      });
    });
  });
  
  // Track CTA button clicks
  const ctaButtons = document.querySelectorAll('a[href*="/contact"], a[href*="/get-started"], a[href*="/services"]');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
      trackEvent('cta_click', {
        button_text: button.textContent.trim(),
        destination: button.href,
        page_location: window.location.pathname
      });
    });
  });
  
  // Track phone number clicks
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('phone_click', {
        phone_number: link.href.replace('tel:', ''),
        page_location: window.location.pathname
      });
    });
  });
  
  // Track email clicks
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('email_click', {
        email_address: link.href.replace('mailto:', ''),
        page_location: window.location.pathname
      });
    });
  });
});
