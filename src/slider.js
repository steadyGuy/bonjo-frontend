export default class Gallery {

  constructor(galleryElement, setup) {

    this.defaults = {
      margin: 0,		// расстояние между элементами [px]
      visibleItems: 1,		// сколько элементов показывать одновременно
      border: 0,		// толщина рамки изображения прописанная в CSS [px]
      responsive: false,	// адаптивная галерея
      autoScroll: false,	// автоматическое прокручивание
      interval: 6000,	// задержка при автоматическом прокручивании [ms]
      nav: true,	// показать/скрыть кнопки next/prev
      dots: true,	// показать/скрыть постраничную навигацию
      keyControl: false,	// управление клавишами вправо / влево
      baseTransition: 1.3,	// скорость анимации, при изменении CSS свойств [s]
      delayTimer: 250,	// время задержки при resize страницы [ms]
      dotsType: 'default',
      zoom: false,
      limit: 30		// ограничиваем перемещение крайних элементов [px]
    }

    this.setup = setup
    //DOM elements
    this.gallery = galleryElement
    this.slider = this.gallery.querySelector('.slider')
    this.items = this.gallery.querySelectorAll('.slide')
    this.count = this.items.length // количество елементов в галереи

    this.current = 0;		// index координаты текущего элемента
    this.next = 0;			// index координаты следующего элемента
    this.pressed = false;	// указывает, что совершилось событие 'mousedown'
    this.start = 0;			// координата, с которой начато перетаскивание
    this.shift = 0;			// на сколько был перемещён курсор относительно start

  }

  init() {
    // объединяем настройки по умолчанию с пользовательскими настройками
    this.options = this.extend({}, this.defaults, this.setup);

    // формируем каркас галереи
    this.setSizeCarousel();
    // заполняем массив с координатами X каждого элемента слайдера
    this.setCoordinates();
    // формируем управление слайдером в зависимости от настроек
    this.initControl();
    // устанавливаем обработчики событий, если ещё не устанавливались

    if (this.options.zoom) {
      this.zoom();
    }

    if (!this.events) {
      this.registerEvents();
    }
  }

  extend(...out) {
    let options = out[0] || {}
    Object.assign(options, ...out)

    return options
  }

  setSizeCarousel() {
    this.sliderWidth = this.slider.offsetWidth
    this.max = this.count - this.options.visibleItems

    const width = (this.sliderWidth - this.options.margin * (this.options.visibleItems - 1)) / this.options.visibleItems
    this.width = width + this.options.margin
    this.containerWidth = this.width * this.count // ширина контейнера поза видимой страницой включно

    // this.stage.style.width = this.containerWidth + 'px'
    this.items.forEach(element => {
      element.style.transition = this.options.baseTransition + 's'
      element.style.transitionProperty = `opacity`
    })

    this.gallery.style.visibility = 'visible'
    this.items[this.current].className = 'slide showing'
  }

  setCoordinates() {
    let point = 0 // начальная координата слайда
    this.coordinates = []

    while (this.coordinates.length < this.count) {
      this.coordinates.push(point)

      point -= this.width
    }
  }

  initControl() {

    this.navCtrl = this.gallery.querySelector('.nav-ctrl');

    this.dotsCtrl = document.querySelector('.dots-ctrl')

    if (this.options.nav === true) {
      this.btnPrev = this.navCtrl.querySelector('[data-shift=prev]')
      this.btnNext = this.navCtrl.querySelector('[data-shift=next]')

      this.setNavStyle()
      this.navCtrl.style.display = 'block'
    } else {
      this.navCtrl.removeAttribute('style');
    }

    if (this.options.dots === true) {
      this.creatDotsCtrl();
      this.dotsCtrl.style.display = 'flex';
    } else {
      this.dotsCtrl.removeAttribute('style');
    }

  }

  creatDotsCtrl() {
    this.spots = [];

    // при ресайзе страницы удаляем элементы постраничной навигации, т.к
    // она будет перестроена исходя из новых настроек, актуальных для текущего
    // разрешения (ширины экрана)
    this.dotsCtrl.innerHTML = '';

    const div = document.createElement('div');

    let divClone, i = 0;
    while (i < this.count) {
      divClone = div.cloneNode(true);
      //Для второго слайдера
      if (this.options.dotsType === 'image') {
        const img = document.createElement('img');
        img.src = this.items[i].querySelector('div').dataset.bg;
        img.alt = this.items[i].querySelector('div').dataset.info;
        console.log(img)
        divClone.append(img)
      }
      this.dotsCtrl.append(divClone);
      this.spots.push(divClone)
      i += this.options.visibleItems;
    }
    this.setDotsStyle();
  }

  setDotsStyle() {
    // перебираем массив и делаем все элементы массива неактивными
    this.spots.forEach(function (item, i, spots) {
      item.classList.remove('active');
    });
    // находим индекс элемента, который необходимо сделать активным
    // метод Math.trunc() возвращает целую часть числа путём удаления всех дробных знаков.
    let index = (this.next < this.max) ? Math.trunc(this.next / this.options.visibleItems) : this.spots.length - 1;
    // добавляем класс элементу с найденным индексом
    this.spots[index].classList.add('active');
    return;
  }

  dotsControl(e) {
    if (e.target.classList.contains('active')) return;
    let index = this.spots.indexOf(e.target);
    if (this.options.dotsType === 'image') index = this.spots.indexOf(e.target.closest('div'));
    if (index == -1) return;
    this.next = index * this.options.visibleItems;
    // ограничиваем индекс координаты, чтобы при переходе на последнюю страницу,
    // она была полностью заполнена, т.е. на последней странице всегда
    // должно быть visibleItems элементов
    this.next = (this.next <= this.max) ? this.next : this.max;

    this.scroll(this.options.baseTransition);

  }

  setNavStyle() {
    // убираем у всех кнопок класс 'disable', теперь
    // обе кнопки выглядят активными
    this.btnPrev.classList.remove('disable')
    this.btnNext.classList.remove('disable')

    if (this.current == 0) {
      this.btnPrev.classList.add('disable')
    } else if (this.current >= this.count - this.options.visibleItems) {
      this.btnNext.classList.add('disable')
    }
    return
  }

  registerEvents() {

    if (this.options.autoScroll) {
      setInterval(this.autoScroll.bind(this), this.options.interval);
    }

    // управление кликом по кнопкам 'prev / next' объекта 'navCtrl'
    this.navCtrl.addEventListener('click', this.navControl.bind(this));
    // управление постраничной навигацией точками
    this.dotsCtrl.addEventListener('click', this.dotsControl.bind(this));

    // управление клавишами вправо / влево
    // будет корректно работать, если на странице только одна галерея, 
    // по умолчанию управление отключено
    // if (this.options.keyControl) {
    //   window.addEventListener('keydown', this.keyControl.bind(this));
    // }

    // // mouse events
    // // управление колёсиком мыши, управление работает, если указатель
    // // мыши находится над DIV'ом с классом 'slider'
    // this.gallery.querySelector('.slider').addEventListener('wheel', this.wheelControl.bind(this))

    // // нажатие кнопки мыши на слайдер
    // this.stage.addEventListener('mousedown', this.tap.bind(this));
    // // прокрутка слайдера перемещением мыши 
    // this.stage.addEventListener('mousemove', this.drag.bind(this));
    // // отпускание кнопки мыши
    // this.stage.addEventListener('mouseup', this.release.bind(this));
    // // курсор мыши выходит за пределы DIV'а с классом 'slider'
    // this.stage.addEventListener('mouseout', this.release.bind(this));

    // // touch events
    // // касание экрана пальцем
    // this.stage.addEventListener('touchstart', this.tap.bind(this));
    // // перемещение пальца по экрану (swipe)
    // this.stage.addEventListener('touchmove', this.drag.bind(this));
    // // палец отрывается от экрана
    // this.stage.addEventListener('touchend', this.release.bind(this));

    // флаг, информирующий о том, что обработчики событий установлены
    this.events = true;

  }

  getNextElement(direction) {
    if (this.options.autoScroll && this.current >= this.count - this.options.visibleItems) {
      this.next = 0;
    } else {
      if ((this.current == 0 && direction == -1) || (this.current >= this.max) && direction == 1) return;
      this.next += direction;
    }
  }

  scroll(transition) {

    this.items[this.current].className = 'slide';
    this.items[this.next].className = 'slide showing';

    this.current = (this.next < this.max) ? this.next : this.max
    console.log('Current:', this.current)


    if (this.options.nav) this.setNavStyle()

    // меняем стили элементов постраничной навигации
    if (this.options.dots) this.setDotsStyle()

    if (this.options.zoom) {
      this.zoom();
    }
    return;
  }

  zoom() {
    this.slider.addEventListener('mouseenter', (e) => {
      if (e.target.tagName != 'DIV') return;
      this.setZoom();
    }, false);

    this.slider.addEventListener('mousemove', (e) => {
      if (e.target.tagName != 'DIV') return;

      // getBoundingClientReact gives us various information about the position of the element.
      var dimentions = e.currentTarget.getBoundingClientRect();

      // Calculate the position of the cursor inside the element (in pixels).
      var x = e.clientX - dimentions.left;
      var y = e.clientY - dimentions.top;

      // Calculate the position of the cursor as a percentage of the total size of the element.
      var xpercent = Math.round(100 / (dimentions.width / x));
      var ypercent = Math.round(100 / (dimentions.height / y));
      this.setZoom()

      // Update the background position of the image.
      this.items[this.current].children[0].style.backgroundPosition = xpercent + '% ' + ypercent + '%';

    }, false);

    this.slider.addEventListener('mouseleave', (e) => {
      if (e.target.tagName != 'DIV') return;
      this.resetZoom()
    }, false);

  }

  resetZoom() {
    this.items[this.current].children[0].style.backgroundSize = "cover";
    this.items[this.current].children[0].style.backgroundPosition = "center";
  }

  setZoom() {
    this.items[this.current].children[0].style.backgroundSize = "250%";
  }

  autoScroll() {

    this.items[this.current].className = 'slide';
    this.items[this.next].className = 'slide showing';
    this.getNextElement(1);
    // // запускаем прокручивание галереи
    this.scroll.call(this, this.options.baseTransition);
    return;
  }

  navControl(e) {
    let span = e.target.closest('span');
    if (!span) return;

    let direction = (span.getAttribute('data-shift') == 'next') ? 1 : -1
    this.getNextElement(direction);
    if (this.options.zoom) this.resetZoom();

    this.scroll(this.options.baseTransition);
  }

}