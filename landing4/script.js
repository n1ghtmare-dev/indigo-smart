/* New home — поведение: прогресс, шапка, reveal, вкладки, меню, параллакс.
   Всё лишнее гаснет при prefers-reduced-motion. */
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

  /* появление секций — детерминированной проверкой позиции */
  const items = [...document.querySelectorAll('.reveal')];
  if (calm) items.forEach(el => el.classList.add('in'));
  else {
    let pending = items, queued = false;
    const sweep = () => {
      queued = false;
      const edge = innerHeight * 0.9, rest = [];
      for (const el of pending) {
        if (el.getBoundingClientRect().top < edge) el.classList.add('in');
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

  /* параллакс: элементы «выезжают» относительно скролла (только десктоп, не calm) */
  const fine = matchMedia('(min-width:901px) and (hover:hover)').matches;
  const px = [...document.querySelectorAll('[data-parallax]')];
  if (fine && !calm && px.length) {
    let ticking = false;
    const apply = () => {
      ticking = false;
      const vh = innerHeight;
      for (const el of px) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const centre = r.top + r.height / 2;
        const off = (centre - vh / 2) / vh;              // -0.5..0.5
        const amt = parseFloat(el.dataset.parallax) || 0; // px амплитуда
        el.style.transform = `translate3d(0, ${(off * amt).toFixed(1)}px, 0)`;
      }
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
    addEventListener('scroll', req, { passive: true });
    addEventListener('resize', req, { passive: true });
    apply();
  }

  /* вкладки направлений */
  const tabs = [...document.querySelectorAll('.tab')];
  const panels = [...document.querySelectorAll('.panel')];
  if (tabs.length) {
    const activate = key => {
      tabs.forEach(t => {
        const on = t.dataset.tab === key;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      panels.forEach(p => { p.hidden = p.dataset.panel !== key; });
    };
    tabs.forEach(t => t.addEventListener('click', () => activate(t.dataset.tab)));
  }

  /* меню на узких экранах */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  if (burger && menu) {
    const set = open => {
      menu.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.classList.toggle('is-open', open);
      document.body.classList.toggle('lock', open);
      burger.querySelector('.burger__t').textContent = open ? 'Закрыть' : 'Меню';
    };
    burger.addEventListener('click', () => set(menu.hidden));
    menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) set(false); });
    matchMedia('(min-width:961px)').addEventListener('change', ev => { if (ev.matches && !menu.hidden) set(false); });
  }
})();
