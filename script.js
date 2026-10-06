(function () {
  // Seeded PRNG so the scattered background icons stay stable between loads.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function placeIcons() {
    var pageEl = document.querySelector('.page');
    var bgSvg = document.getElementById('bgIcons');
    var field = document.getElementById('iconField');
    if (!pageEl || !bgSvg || !field) return;

    // Skip the decorative field on narrow viewports -- there's no safe
    // margin to scatter icons in without cluttering the text column.
    if (window.innerWidth < 700) {
      bgSvg.style.display = 'none';
      return;
    }
    bgSvg.style.display = '';

    field.innerHTML = '';
    var W = pageEl.getBoundingClientRect().width;
    var H = pageEl.getBoundingClientRect().height;
    bgSvg.setAttribute('width', W);
    bgSvg.setAttribute('height', H);
    bgSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    var rand = mulberry32(1337);
    var icons = ['icoUfo', 'icoRocket', 'icoAlien', 'icoAtom', 'icoStar'];
    var colors = ['#F3E6C8', '#E3A857', '#1F9E96'];

    // keep-out band around the central text column (as a proportion of the page)
    var koLeft = W * 0.32, koRight = W * 0.68;
    var koTop = H * 0.20, koBottom = H * 0.62;
    function inKeepOut(x, y) {
      return x > koLeft && x < koRight && y > koTop && y < koBottom;
    }

    var placed = 0, tries = 0;
    var target = Math.max(18, Math.min(46, Math.round((W * H) / 42000)));
    while (placed < target && tries < 1200) {
      tries++;
      var x = rand() * W;
      var y = rand() * H;
      if (inKeepOut(x, y) && rand() > 0.12) continue;
      var icon = icons[Math.floor(rand() * icons.length)];
      var color = colors[Math.floor(rand() * colors.length)];
      var scale = (0.35 + rand() * 0.85) * (W / 1440);
      var rotRange = (icon === 'icoUfo' || icon === 'icoRocket') ? 26 : 360;
      var rot = Math.floor(rand() * rotRange * 2 - rotRange);
      var op = (0.08 + rand() * 0.15).toFixed(2);
      var size = icon === 'icoRocket' ? 30 : (icon === 'icoAlien' ? 34 : (icon === 'icoUfo' ? 46 : 28));

      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') rotate(' + rot + ') scale(' + scale.toFixed(2) + ')');
      g.setAttribute('opacity', op);
      g.setAttribute('color', color);
      var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#' + icon);
      use.setAttribute('x', -size / 2);
      use.setAttribute('y', -size / 2);
      use.setAttribute('width', size);
      use.setAttribute('height', size);
      g.appendChild(use);
      field.appendChild(g);
      placed++;
    }
  }

  document.addEventListener('DOMContentLoaded', placeIcons);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(placeIcons, 200);
  });
})();


// Video cards: each card is a plain link to its mp4 (works without JS).
// With JS, tapping a card swaps the poster for an inline player, so no
// video data is downloaded until someone presses play.
(function () {
  var cards = document.querySelectorAll('.reel');
  if (!cards.length) return;

  function stopAll(except) {
    cards.forEach(function (card) {
      if (card === except) return;
      var v = card.querySelector('video');
      if (v) { v.pause(); }
    });
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (card.classList.contains('is-playing')) { e.preventDefault(); return; }
      e.preventDefault();
      stopAll(card);
      var v = document.createElement('video');
      v.src = card.getAttribute('href');
      v.poster = card.querySelector('img').getAttribute('src');
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      v.preload = 'auto';
      v.setAttribute('aria-label', 'The Ixellites play ' + card.getAttribute('data-title'));
      card.classList.add('is-playing');
      var play = card.querySelector('.reel-play');
      if (play) play.style.display = 'none';
      card.appendChild(v);
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });
  });
})();
