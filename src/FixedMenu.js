const defaultPadding = 28;

export default class FixedMenu {
  constructor(bg = '#222222', padding = 20) {
    this.background = bg;
    this.padding = padding;
    this.menu = document.querySelector('.menu-bar');
    this.defaultBackground = this.menu.dataset.bg || 'transparent';
  }

  addScroll() {
    window.addEventListener('scroll', () => {
      this.setStyle(window.pageYOffset)
    })
  }

  setStyle(offset) {
    if (offset >= 20) {
      this.menu.style.backgroundColor = this.background
      this.menu.style.paddingTop = `${this.padding}px`
      this.menu.style.paddingBottom = `${this.padding}px`
      this.menu.style.color = '#111111';
    } else {
      this.menu.style.paddingTop = `${defaultPadding}px`
      this.menu.style.paddingBottom = `${defaultPadding}px`
      this.menu.style.backgroundColor = this.defaultBackground
    }
  }

}