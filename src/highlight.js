export default function addActiveBtnsEvent() {
  document.addEventListener("DOMContentLoaded", () => {
    const elementsMob = document.querySelectorAll('.slide-menu__link');
    const elements = document.querySelectorAll('.navigation__link');
    const elementsFoot = document.querySelectorAll('.footer__link');
    for (let i = 0; i < elements.length; i++) {
      elementsMob[i].className = "slide-menu__link";
      elements[i].className = "navigation__link";
      elementsFoot[i].className = "footer__link";
      if (document.location.href == elements[i].href) {
        elements[i].classList.toggle('navigation__link_active');
        elementsMob[i].classList.toggle('slide-menu__link_active');
        elementsFoot[i].classList.toggle('footer__link_active');
      }
    }
  });
}