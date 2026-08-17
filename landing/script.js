/* Школа-студия красоты Ксении Аракелян — поведение страницы.
   Движения ровно столько, сколько нужно: сцена загрузки, появление
   секций, блик по имени, меню на узких экранах. */

(() => {
  'use strict';

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── Линейка прокрутки и уплотнение шапки ─────────────────────── */
  const ruler = document.querySelector('.ruler i');
  const bar = document.getElementById('bar');

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (ruler) ruler.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (bar) bar.classList.toggle('bar--tight', scrollY > 40);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Появление секций ─────────────────────────────────────────────
     Проверяем положение сами, а не через IntersectionObserver: он
     пропускает элементы, если страницу проносит мимо них рывком, и
     блоки остаются невидимыми навсегда. */
  const revealables = [...document.querySelectorAll('.reveal, .head')];

  if (calm) {
    revealables.forEach(el => el.classList.add('is-in'));
  } else {
    document.querySelectorAll('.section').forEach(section => {
      section.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.setProperty('--d', `${Math.min(i, 5) * 0.07}s`);
      });
    });

    let pending = revealables;
    let queued = false;

    const sweep = () => {
      queued = false;
      const edge = innerHeight * 0.9;
      const rest = [];
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

  /* ── Блик по имени ────────────────────────────────────────────── */
  const shine = document.getElementById('shine');

  if (shine && fine && !calm) {
    let px = innerWidth / 2, py = innerHeight / 3;
    let cx = px, cy = py, running = false;
    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

    const frame = () => {
      cx += (px - cx) * 0.09;
      cy += (py - cy) * 0.09;
      const r = shine.getBoundingClientRect();
      shine.style.setProperty('--mx', `${clamp(cx - r.left, -0.2 * r.width, 1.2 * r.width)}px`);
      shine.style.setProperty('--my', `${clamp(cy - r.top, -0.6 * r.height, 1.6 * r.height)}px`);
      if (Math.abs(px - cx) > 0.4 || Math.abs(py - cy) > 0.4) requestAnimationFrame(frame);
      else running = false;
    };

    addEventListener('pointermove', e => {
      px = e.clientX; py = e.clientY;
      if (!running) { running = true; requestAnimationFrame(frame); }
    }, { passive: true });
  }

  /* ── Меню на узких экранах ────────────────────────────────────── */
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');

  if (burger && menu) {
    const setOpen = open => {
      menu.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('is-locked', open);
      burger.classList.toggle('is-open', open);
      burger.querySelector('.burger__text').textContent = open ? 'Закрыть' : 'Меню';
    };

    burger.addEventListener('click', () => setOpen(menu.hidden));
    menu.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setOpen(false); });
    // Меню только для узких экранов: при расширении окна закрываем
    matchMedia('(min-width: 1001px)').addEventListener('change', ev => {
      if (ev.matches && !menu.hidden) setOpen(false);
    });
  }
})();
