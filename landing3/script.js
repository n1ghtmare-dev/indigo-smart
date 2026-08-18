/* DarFit — поведение страницы. Всё необязательное гаснет при reduce-motion. */
(() => {
  'use strict';
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* прогресс + уплотнение шапки */
  const bar = document.getElementById('bar');
  const prog = document.querySelector('.progress i');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (bar) bar.classList.toggle('bar--tight', scrollY > 30);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* появление секций — детерминированной проверкой (не теряет блоки при рывке) */
  const items = [...document.querySelectorAll('.reveal')];
  if (calm) {
    items.forEach(el => el.classList.add('is-in'));
  } else {
    document.querySelectorAll('.section, .cta-wrap, .community').forEach(sec => {
      sec.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--d', Math.min(i, 5) * 0.07 + 's'));
    });
    let pending = items, queued = false;
    const sweep = () => {
      queued = false;
      const edge = innerHeight * 0.9, rest = [];
      for (const el of pending) {
        if (el.getBoundingClientRect().top < edge) el.classList.add('is-in');
        else rest.push(el);
      }
      pending = rest;
      if (!pending.length) removeEventListener('scroll', onMove);
    };
    const onMove = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
    addEventListener('scroll', onMove, { passive: true });
    addEventListener('resize', onMove, { passive: true });
    sweep();
  }

  /* форма-заявка → ВКонтакте студии (реальный канал записи) */
  const form = document.getElementById('capture');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    window.open('https://vk.com/studio_darfit', '_blank', 'noopener');
  });

  /* меню на узких экранах */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  if (burger && menu) {
    const set = open => {
      menu.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
      burger.querySelector('.burger__t').textContent = open ? 'Закрыть' : 'Меню';
    };
    burger.addEventListener('click', () => set(menu.hidden));
    menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) set(false); });
    matchMedia('(min-width:941px)').addEventListener('change', ev => { if (ev.matches && !menu.hidden) set(false); });
  }
})();
