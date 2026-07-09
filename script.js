const loading = document.querySelector('.loading');
const backToTop = document.getElementById('backToTop');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('themeToggle');
const jobSearchForm = document.getElementById('jobSearchForm');
const jobTitleInput = document.getElementById('jobTitle');
const jobLocationInput = document.getElementById('jobLocation');
const jobCategoryInput = document.getElementById('jobCategory');
const jobCards = Array.from(document.querySelectorAll('.job-card'));
const emptyState = document.getElementById('emptyState');
const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
const faqItems = Array.from(document.querySelectorAll('.faq-item'));
const newsletterForm = document.getElementById('newsletterForm');
const contactForm = document.getElementById('contactForm');
const newsletterMessage = document.getElementById('newsletterMessage');
const contactMessageBox = document.getElementById('contactMessageBox');

window.addEventListener('load', () => {
  setTimeout(() => loading.classList.add('hidden'), 500);
});

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

const savedTheme = localStorage.getItem('northstar-theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('northstar-theme', isDark ? 'dark' : 'light');
  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

function filterJobs() {
  const title = jobTitleInput.value.trim().toLowerCase();
  const location = jobLocationInput.value.trim().toLowerCase();
  const category = jobCategoryInput.value.toLowerCase();

  let visibleCount = 0;

  jobCards.forEach((card) => {
    const role = card.dataset.role || '';
    const cardLocation = card.dataset.location || '';
    const cardCategory = card.dataset.category || '';
    const matchesTitle = role.includes(title) || title === '';
    const matchesLocation = cardLocation.includes(location) || location === '';
    const matchesCategory = cardCategory === category || category === '';

    const shouldShow = matchesTitle && matchesLocation && matchesCategory;
    card.style.display = shouldShow ? 'block' : 'none';
    if (shouldShow) visibleCount += 1;
  });

  emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
}

jobSearchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  filterJobs();
});

function showTestimonial(index) {
  testimonialCards.forEach((card, cardIndex) => {
    card.classList.toggle('active', cardIndex === index);
  });
}

let currentTestimonial = 0;
setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
  showTestimonial(currentTestimonial);
}, 6000);

document.querySelector('.carousel-btn.prev').addEventListener('click', () => {
  currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
  showTestimonial(currentTestimonial);
});

document.querySelector('.carousel-btn.next').addEventListener('click', () => {
  currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
  showTestimonial(currentTestimonial);
});

faqItems.forEach((item) => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    faqItems.forEach((entry) => entry.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count || 0);
      const suffix = element.dataset.suffix || '';
      let current = 0;
      const duration = 1600;
      const startTime = performance.now();

      const tick = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        current = Math.floor(progress * target);
        element.textContent = `${current}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(element);
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll('.stats-card h3').forEach((counter) => counterObserver.observe(counter));

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('newsletterEmail').value.trim();
  if (!email || !email.includes('@')) {
    newsletterMessage.textContent = 'Please enter a valid email address.';
    newsletterMessage.className = 'form-message error';
    return;
  }

  newsletterMessage.textContent = 'Thanks for subscribing! Weekly opportunities are on the way.';
  newsletterMessage.className = 'form-message success';
  newsletterForm.reset();
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  if (!name || !email || !message || !email.includes('@')) {
    contactMessageBox.textContent = 'Please fill out every field with a valid email.';
    contactMessageBox.className = 'form-message error';
    return;
  }

  contactMessageBox.textContent = 'Message sent successfully! We will reply shortly.';
  contactMessageBox.className = 'form-message success';
  contactForm.reset();
});
