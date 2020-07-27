import {forEachPolyfill} from './utils/polyfill-foreach';
import {initIe11Download} from './utils/init-ie11-download';
import {menu} from './utils/menu';
import {homepage} from './modules/homepage';
import {productInner} from './modules/product-inner';
import {order} from './modules/order';
import {cart} from './modules/cart';

// Utils
// ---------------------------------
forEachPolyfill();
initIe11Download();

menu(`.top-menu__left-menu`, `.top-menu__left-menu-burger`, `.top-menu__left-menu-overlay`);
menu(`.top-menu__nav`, `.top-menu__nav-toggle-burger`, `.top-menu__nav-toggle-overlay`);


// Modules
// ---------------------------------
homepage();
productInner();
order();
cart();

const ie11Download = (el) => {
  if (el.href === ``) {
    throw Error(`The element has no href value.`);
  }

  let filename = el.getAttribute(`download`);
  if (filename === null || filename === ``) {
    const tmp = el.href.split(`/`);
    filename = tmp[tmp.length - 1];
  }

  el.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.onloadstart = () => {
      xhr.responseType = `blob`;
    };
    xhr.onload = () => {
      navigator.msSaveOrOpenBlob(xhr.response, filename);
    };
    xhr.open(`GET`, el.href, true);
    xhr.send();
  });
};

const downloadLinks = document.querySelectorAll(`a[download]`);

const initIe11Download = () => {
  if (window.navigator.msSaveBlob) {
    if (downloadLinks.length) {
      downloadLinks.forEach((el) => {
        ie11Download(el);
      });
    }
  }
};

export {initIe11Download};

export const menu = (menuClass, burgerClass, overlayClass) => {
  const menuElem = document.querySelector(menuClass);
  const brugerElem = menuElem.querySelector(burgerClass);
  const overlayElem = menuElem.querySelector(overlayClass);

  const escKeyDownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      closeMenuHandler();
    }
  };

  const openMenuHandler = () => {
    menuElem.classList.add(`active`);
    brugerElem.querySelector(`.burger`).classList.add(`active`);
    document.addEventListener(`keydown`, escKeyDownHandler);
  }

  const closeMenuHandler = () => {
    menuElem.classList.remove(`active`);
    brugerElem.querySelector(`.burger`).classList.remove(`active`);
    document.removeEventListener(`keydown`, escKeyDownHandler);
  }

  brugerElem.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const isOpen = menuElem.classList.contains(`active`);

    if (!isOpen) {
      openMenuHandler();
    } else {
      closeMenuHandler();
    }
  });

  overlayElem.addEventListener(`click`, () => {
    closeMenuHandler();
  })
}

const forEachPolyfill = () => {
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
};

export {forEachPolyfill};

const body = document.querySelector(`body`);

const getScrollbarWidth = () => {
  const outer = document.createElement(`div`);
  outer.style.visibility = `hidden`;
  outer.style.overflow = `scroll`;
  outer.style.msOverflowStyle = `scrollbar`;
  body.appendChild(outer);
  const inner = document.createElement(`div`);
  outer.appendChild(inner);
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
  outer.parentNode.removeChild(outer);
  if (outer.offsetWidth !== inner.offsetWidth) {
    return scrollbarWidth;
  }
};

const getBodyScrollTop = () => {
  return (
    self.pageYOffset ||
    (document.documentElement && document.documentElement.ScrollTop) ||
    (body && body.scrollTop)
  );
};

const disableScrolling = () => {
  const scrollWidth = getScrollbarWidth();
  body.setAttribute(`style`, `padding-right: ` + scrollWidth + `px;`);
  body.dataset.scrollY = `${getBodyScrollTop()}`;
  body.style.top = `-${body.dataset.scrollY}px`;
  body.classList.add(`scroll-lock`);
};

const enableScrolling = () =>{
  body.removeAttribute(`style`);
  body.classList.remove(`scroll-lock`);
  window.scrollTo(0, +body.dataset.scrollY);
};

export {enableScrolling, disableScrolling};

export const slideUp = (target, duration) => {
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.boxSizing = 'border-box';
  target.style.height = target.offsetHeight + 'px';

  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.style.overflow = 'hidden';

  window.setTimeout( () => {
    target.style.display = 'none'; /* [8] */
    target.style.removeProperty('height'); /* [9] */
    target.style.removeProperty('padding-top');  /* [10.1] */
    target.style.removeProperty('padding-bottom');  /* [10.2] */
    target.style.removeProperty('margin-top');  /* [11.1] */
    target.style.removeProperty('margin-bottom');  /* [11.2] */
    target.style.removeProperty('overflow');  /* [12] */
    target.style.removeProperty('transition-duration');  /* [13.1] */
    target.style.removeProperty('transition-property');  /* [13.2] */
  }, duration);
}


export const slideDown = (target, duration) => {
  target.style.removeProperty('display');
  let display = window.getComputedStyle(target).display;
  if (display === 'none') {
    display = 'block';
  }
  target.style.display = display;

  let height = target.offsetHeight;
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.style.overflow = 'hidden';

  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');

  window.setTimeout( () => {
    target.style.removeProperty('height'); /* [13] */
    target.style.removeProperty('overflow'); /* [14] */
    target.style.removeProperty('transition-duration'); /* [15.1] */
    target.style.removeProperty('transition-property'); /* [15.2] */
  }, duration);
}

export const slideToggle = (target, duration = 500) => {
  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
}

export const cart = () => {
  const cartElem = document.querySelector(`.cart`);

  if (cartElem) {
    const cartTogglesElems = document.querySelectorAll(`.js-cart-toggles`);
    cartTogglesElems.forEach((elem) => {
      const DISABLED_TOGGLE_CLASS_NAME = ``;
      const minusELem = elem.querySelector(`.js-cart-toggle-minus`);
      const plusELem = elem.querySelector(`.js-cart-toggle-plus`);
      const ammountElem = elem.querySelector(`.js-cart-amount`);

      minusELem.addEventListener(`click`, () => {
        if (ammountElem.value > 0) {
          ammountElem.value -= 1;
        } else {
          minusELem.classList.add(DISABLED_TOGGLE_CLASS_NAME);
        }
      });

      plusELem.addEventListener(`click`, () => {
        if (minusELem.classList.contains(DISABLED_TOGGLE_CLASS_NAME)) {
          minusELem.classList.remove(DISABLED_TOGGLE_CLASS_NAME)
        }
        ammountElem.value = parseInt(ammountElem.value) + 1;
      });
    });
  }
}

export const homepage = () => {

  const factsSlider = document.querySelector('.home-facts .swiper-container');
  let factsSliderSwiper;

  function factsMobileSlider() {
    if (factsSlider) {
      if (window.innerWidth <= 768 && factsSlider.dataset.mobile == 'false') {
        factsSliderSwiper = new Swiper(factsSlider, {
          loop: true,
          autoplay: {
            delay: 5000,
          }
        });

        factsSlider.dataset.mobile = 'true';
      }

      if (window.innerWidth > 768) {
        factsSlider.dataset.mobile = 'false';
        if (factsSlider.classList.contains('swiper-container-initialized')) {
          factsSliderSwiper.destroy();
        }
      }
    }
  }



  const salesSlider = document.querySelector('.home-sales .swiper-container');
  let salesSliderSwiper;

  function salesMobileSlider() {
    if (salesSlider) {
      if (window.innerWidth <= 768 && salesSlider.dataset.mobile == 'false') {
        salesSliderSwiper = new Swiper(salesSlider, {
          loop: true,
          autoplay: {
            delay: 5000,
          },
          slidesPerView: 1,
          breakpoints: {
            540: {
              slidesPerView: 2,
            }
          }
        });

        salesSlider.dataset.mobile = 'true';
      }

      if (window.innerWidth > 768) {
        salesSlider.dataset.mobile = 'false';
        if (salesSlider.classList.contains('swiper-container-initialized')) {
          salesSliderSwiper.destroy();
        }
      }
    }
  }

  factsMobileSlider();
  salesMobileSlider();

  window.addEventListener('resize', () => {
    factsMobileSlider();
    salesMobileSlider();
  });

}

export const order = () => {
  const orderElem = document.querySelector(`.order`);

  if (orderElem) {
    const togglePersonElem = orderElem.querySelector(`.js-order-toggle-person`);
    const toggleCompanyElem = orderElem.querySelector(`.js-order-toggle-company`);
    const formPersonElem = orderElem.querySelector(`.js-order-form-person`);
    const formCompanyElem = orderElem.querySelector(`.js-order-form-company`);

    console.log(togglePersonElem);



    const openPersonForm = () => {
      if(togglePersonElem.checked) {
        formPersonElem.classList.add(`active`);

        formCompanyElem.classList.remove(`active`)
      }
    }

    const openCompanyForm = () => {
      if(toggleCompanyElem.checked) {
        formCompanyElem.classList.add(`active`);

        formPersonElem.classList.remove(`active`)
      }
    }

    toggleCompanyElem.addEventListener(`change`, () => {
      openCompanyForm();
    });

    togglePersonElem.addEventListener(`change`, () => {
      openPersonForm();
    });

  }
}

export const productInner = () => {
  const productInnerElem = document.querySelector(`.product-inner`);

  if (productInnerElem) {
    var mySwiper = new Swiper(`.product-inner .swiper-container`, {
      loop: true,
      slidesPerView: 1,
      navigation: {
        nextEl: `.swiper-button-next`,
        prevEl: `.swiper-button-prev`,
      },
      breakpoints: {

        500: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        }
      }
    });


    const setPrice = () => {
      const formElem = document.querySelector(`.js-product-inner-form`);
      const radioElems = formElem.querySelectorAll(`.js-product-inner-radio`);
      const priceElem = formElem.querySelector(`.js-product-inner-price`);

      const updatePrice = () => {
        const radioElem = [...radioElems].filter((elem) => elem.checked)[0];
        priceElem.textContent = radioElem.value.toLocaleString('ru-RU') + ` Р`;
      }

      if (formElem) {
        updatePrice();
        formElem.addEventListener(`change`, () => {
          updatePrice();
        });
      }
    }

    setPrice();
  }
}
