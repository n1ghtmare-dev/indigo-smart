const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', () => {
  document.body.classList.add('is-scrolling');
  setTimeout(() => document.body.classList.remove('is-scrolling'), 700);
}));

if (new URLSearchParams(window.location.search).has('capture')) {
  document.body.classList.add('capture-mode');
}
