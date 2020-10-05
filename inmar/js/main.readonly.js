import {forEachPolyfill} from './utils/polyfill-foreach';
import {initIe11Download} from './utils/init-ie11-download';
import {menu} from './utils/menu';
import {footer} from './modules/footer';
import {homepage} from './modules/homepage';
import {productInner} from './modules/product-inner';
import {order} from './modules/order';
import {cart} from './modules/cart';
import {contacts} from './modules/contacts';
import {portfolioInner} from './modules/portfolio-inner';

// Utils
// ---------------------------------
forEachPolyfill();
initIe11Download();

menu(`.top-menu__left-menu`, `.top-menu__left-menu-burger`, `.top-menu__left-menu-overlay`);
menu(`.top-menu__nav`, `.top-menu__nav-toggle-burger`, `.top-menu__nav-toggle-overlay`);


// Modules
// ---------------------------------
footer();
homepage();
productInner();
order();
cart();
contacts();
portfolioInner();

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

export const setModalEvents = (modalElem, openBtnElem, modalClassName) => {
  const overlayElem = modalElem.querySelector(`.js-modal-overlay`);
  const closeBtnElem = modalElem.querySelector(`.js-modal-close`);

  const openModalHandler = () => {
    if (modalElem) {
      modalElem.classList.add(modalClassName);
      document.addEventListener(`keydown`, escKeyDownHandler);
      document.body.classList.add(`scroll-lock`);
    }
  };

  const closeModalHandler = () => {
    modalElem.classList.remove(modalClassName);
    document.removeEventListener(`keydown`, escKeyDownHandler);
    if (document.body.classList.contains(`scroll-lock`)) {
      document.body.classList.remove(`scroll-lock`);
    }
  };

  const escKeyDownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      closeModalHandler();
    }
  };

  if (openBtnElem) {
    openBtnElem.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      openModalHandler();
    });
  }


  if (overlayElem) {
    overlayElem.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      closeModalHandler();
    });
  }


  if (closeBtnElem) {
    closeBtnElem.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      closeModalHandler();
    });
  }
}

export const cart = () => {
  const cartElem = document.querySelector(`.cart`);

  if (cartElem) {
    const cartTogglesElems = document.querySelectorAll(`.js-cart-toggles`);
    cartTogglesElems.forEach((elem) => {
      const minusELem = elem.querySelector(`.js-cart-toggle-minus`);
      const plusELem = elem.querySelector(`.js-cart-toggle-plus`);
      const ammountElem = elem.querySelector(`.js-cart-amount`);

      minusELem.addEventListener(`click`, () => {
        if (ammountElem.value > 0) {
          ammountElem.value -= 1;
        }

        if (ammountElem.value <= 0) {
          minusELem.setAttribute(`disabled`, true);
        }
      });

      plusELem.addEventListener(`click`, () => {
        if (minusELem.hasAttribute(`disabled`) && ammountElem.value >= 0) {
          minusELem.removeAttribute(`disabled`)
        }
        ammountElem.value = parseInt(ammountElem.value) + 1;
      });

      ammountElem.addEventListener(`change`, () => {
        if (ammountElem.value <= 0) {
          ammountElem.value = 0;
          minusELem.setAttribute(`disabled`, true);
        } else if (minusELem.hasAttribute(`disabled`)) {
          minusELem.removeAttribute(`disabled`);
        }
      });
    });
  }
}

import {setModalEvents} from '../utils/set-modal-events';

export const contacts = () => {
  const modal1 = document.querySelector(`.js-modal-1`);
  const modal2 = document.querySelector(`.js-modal-2`);

  const modal1OpenBtn = document.querySelector(`.js-contacts-modal-opener-1`);
  const modal2OpenBtn = document.querySelector(`.js-contacts-modal-opener-2`);



  if (modal1 && modal1OpenBtn) {
    setModalEvents(modal1, modal1OpenBtn, `modal--open`);
  }

  if (modal2 && modal1OpenBtn) {
    setModalEvents(modal2, modal2OpenBtn, `modal--open`);
  }

  // const mapElem = document.querySelector(`.js-contacts-map`);
  // if (mapElem) {
    // let map;

    // function initMap() {
    //   map = new google.maps.Map(mapElem, {
    //     center: { lat: -34.397, lng: 150.644 },
    //     zoom: 8
    //   });
    // }
  // }
}

import {setModalEvents} from '../utils/set-modal-events';

export const footer = () => {
  const modal1 = document.querySelector(`.js-modal-1`);
  const modal2 = document.querySelector(`.js-modal-2`);

  const modal1OpenBtn = document.querySelector(`.js-footer-modal-opener-1`);
  const modal2OpenBtn = document.querySelector(`.js-footer-modal-opener-2`);



  if (modal1 && modal1OpenBtn) {
    setModalEvents(modal1, modal1OpenBtn, `modal--open`);
  }

  if (modal2 && modal1OpenBtn) {
    setModalEvents(modal2, modal2OpenBtn, `modal--open`);
  }
}

import {setModalEvents} from '../utils/set-modal-events';


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



  const modal1 = document.querySelector(`.js-modal-1`);
  const modal2 = document.querySelector(`.js-modal-2`);

  const modal1OpenBtn = document.querySelector(`.js-bn3r-modal-opener-1`);
  const modal2OpenBtn = document.querySelector(`.js-bn3r-modal-opener-2`);



  if (modal1 && modal1OpenBtn) {
    setModalEvents(modal1, modal1OpenBtn, `modal--open`);
  }

  if (modal2 && modal1OpenBtn) {
    setModalEvents(modal2, modal2OpenBtn, `modal--open`);
  }
}

export const order = () => {
  const orderElem = document.querySelector(`.order`);

  if (orderElem) {
    const togglePersonElem = orderElem.querySelector(`.js-order-toggle-person`);
    const toggleCompanyElem = orderElem.querySelector(`.js-order-toggle-company`);
    const formPersonElem = orderElem.querySelector(`.js-order-form-person`);
    const formCompanyElem = orderElem.querySelector(`.js-order-form-company`);

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

export const portfolioInner = () => {
  const modalElem = document.querySelector(`.js-portfolio-modal`);
  const modalOpenBtns = document.querySelectorAll(`.js-portfolio-modal-opener`);
  const MODAL_CLASS_NAME = `portfolio-modal--open`;
  let slider;
  // let sliderThumbs;


  if (modalElem && modalOpenBtns) {
    modalOpenBtns.forEach((btn, index) => {

      const overlayElem = modalElem.querySelector(`.js-modal-overlay`);
      const closeBtnElem = modalElem.querySelector(`.js-modal-close`);

      const openModalHandler = () => {
        if (modalElem) {
          modalElem.classList.add(MODAL_CLASS_NAME);
          document.addEventListener(`keydown`, escKeyDownHandler);

          slider = new Swiper(modalElem.querySelector(`.js-gallery-top`), {
            loop: true,
            navigation: {
              nextEl: `.swiper-button-next`,
              prevEl: `.swiper-button-prev`,
            },
          });
          slider.slideTo(index + 1, 0);

          // sliderThumbs = new Swiper(modalElem.querySelector('.js-gallery-thumbs'), {
          //   spaceBetween: 10,
          //   slidesPerView: 4,
          //   freeMode: true,
          //   watchSlidesVisibility: true,
          //   watchSlidesProgress: true,
          // });
        }
      };

      const closeModalHandler = () => {
          modalElem.classList.remove(MODAL_CLASS_NAME);
          document.removeEventListener(`keydown`, escKeyDownHandler);

          slider.destroy();
          // sliderThumbs.destroy();
      };

      const escKeyDownHandler = (evt) => {
        if (evt.key === `Escape` || evt.key === `Esc`) {
          closeModalHandler();
        }
      };

      if (btn) {
        btn.addEventListener(`click`, (evt) => {
          evt.preventDefault();
          openModalHandler();
        });
      }


      if (overlayElem) {
        overlayElem.addEventListener(`click`, (evt) => {
          evt.preventDefault();
          closeModalHandler();
        });
      }


      if (closeBtnElem) {
        closeBtnElem.addEventListener(`click`, (evt) => {
          evt.preventDefault();
          closeModalHandler();
        });
      }
    });
  }
}

export const productInner = () => {
  const productInnerElem = document.querySelector(`.product-inner`);
  const dataProductInnerInput = document.querySelectorAll(`[data-product-inner-input]`);
  const dataProductInnerPic = document.querySelectorAll(`[data-product-inner-pic]`);


  if (dataProductInnerInput && dataProductInnerPic) {

    const removeActiveClass = () => {
      dataProductInnerPic.forEach((elem) => {
        if (elem.classList.contains(`active`)) {
          elem.classList.remove(`active`);
        }
      });
    }

    removeActiveClass();

    dataProductInnerInput.forEach((elem) => {
      const elemId = elem.dataset.productInnerInput;

      const setActiveClass = () => {
        if (elem.checked) {
          dataProductInnerPic[elemId-1].classList.add(`active`);
        }
      }

      setActiveClass();

      elem.addEventListener(`change`, () => {
        removeActiveClass();
        setActiveClass();
      });
    });
  }

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
