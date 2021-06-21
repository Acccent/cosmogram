import oScrollbars from 'overlayscrollbars';

const $ = id => document.getElementById(id);
const nav = $('topnav');
const bt = nav ? $('backtotop') : undefined;

document.addEventListener('DOMContentLoaded', function () {

  const sc = oScrollbars(document.body, {
    className: 'os-theme-light',
    overflowBehavior: { x: 'h' },
    scrollbars: { autoHide: 'm' },
    callbacks: {
      onScroll: nav ? collapseTopNav : null,
    },
  });

  if (bt && sc.scroll().handleLengthRatio.y < 1) {
    bt.style.display = 'block';

    bt.onclick = () => {
      sc.scroll({ y: 0 }, 500);
    };
  }

  const topnavH = 54;
  const minDeltaDown = 15;
  const minDeltaUp = -20;
  let offset = 0;
  let lastY = sc.scroll().position.y;
  function collapseTopNav() {
    const newY = sc.scroll().position.y;
    const delta = newY - lastY;

    if (
      offset == topnavH && delta < minDeltaUp ||
      offset == 0 && delta > minDeltaDown ||
      offset > 0 && offset < topnavH ||
      newY < topnavH && delta < 0
    ) {
      offset += delta;
      if (offset < 0) { offset = 0; }
      if (offset > topnavH) { offset = topnavH; }
    }

    nav.style.transform = `translateY(-${offset}px)`;

    lastY = newY;
  }

});
