document.addEventListener('alpine:initializing', () => {
  Alpine.data('scroll', () => ({

    init() {
      const scrollJS = OverlayScrollbars(this.$el, {
        className: 'os-theme-light',
        overflowBehavior: { x: 'h' },
        scrollbars: { autoHide: 'm' },
      });
    },

  }));
});
