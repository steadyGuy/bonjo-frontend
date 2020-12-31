export default class MobileMenu {
  constructor() {
    this.hamburger = document.querySelector('.navigation__hamburger')
    this.mobileMenu = document.querySelector('.slide-menu')
  }

  initMenu() {
    const hamb = this.hamburger.children[0];
    hamb.addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('is-active')
      this.mobileMenu.classList.toggle('slide-menu_active');
    })
  }

}