import oScrollbars from 'overlayscrollbars';

const $ = id => document.getElementById(id);
const nav = $('topnav');
const btt = nav ? $('backtotop') : undefined;

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

document.addEventListener('DOMContentLoaded', function () {

  const sc = oScrollbars(document.body, {
    className: 'os-theme-light',
    overflowBehavior: { x: 'h' },
    scrollbars: { autoHide: 'm' },
    callbacks: {
      onScroll: nav ? handleScroll : null,
    },
  });

  const initScData = sc.scroll();

  let bttOn = false;
  if (btt && initScData.handleLengthRatio.y < 1) {
    btt.style.display = 'block';

    btt.onclick = () => {
      sc.scroll({ y: 0 }, 500);
    };

    bttOn = true;
  }

  function handleScroll() {
    const scY = sc.scroll().position.y;

    if (bttOn) {
      btt.style.opacity = clamp(scY * 0.01, 0, 1);
    }

    collapseTopNav(scY);
  }

  const topnavH = 54;
  const minDeltaDown = 15;
  const minDeltaUp = -20;
  let offset = 0;
  let lastY = initScData.position.y;

  function collapseTopNav(newY) {
    const delta = newY - lastY;

    if (
      offset == topnavH && delta < minDeltaUp ||
      offset == 0 && delta > minDeltaDown ||
      offset > 0 && offset < topnavH ||
      newY < topnavH && delta < 0
    ) {
      offset = clamp(offset + delta, 0, topnavH);
    }

    nav.style.transform = `translateY(-${offset}px)`;

    lastY = newY;
  }

});
