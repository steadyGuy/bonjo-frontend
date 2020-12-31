'use strict'

import './sass/main.scss'

import Gallery from './slider.js';
import FixedMenu from './FixedMenu.js';
import MobileMenu from './MobileMenu';
// import CartPopup from './CartPopup';
import CartInfo from './CartInfo';
import activeBtnsEvent from './highlight';

activeBtnsEvent();

const fixedMenu = new FixedMenu('#111111', 12);
fixedMenu.addScroll();

const mobileMenu = new MobileMenu();
mobileMenu.initMenu();

const HomeGallery = document.getElementById('gallery');
const ProductGallery = document.getElementById('shop-gallery');
const isCartPage = document.querySelector('.cart');

if (isCartPage) CartInfo();

if(HomeGallery) {
  const homeSlider = new Gallery(HomeGallery, {
    visibleItems: 1,
    dots: true,
    keyControl: true,
    autoScroll: false
  })
  
  homeSlider.init()
}

if(ProductGallery) {
  const itemSlider = new Gallery(ProductGallery, {
    visibleItems: 1,
    dots: true,
    keyControl: true,
    autoScroll: false,
    dotsType: 'image',
    zoom: true
  })
  
  itemSlider.init()
}