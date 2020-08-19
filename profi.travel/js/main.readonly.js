import {forEachPolyfill} from './utils/polyfill-foreach';
import {initIe11Download} from './utils/init-ie11-download';
import {programDay} from './modules/program-day';
import {bookBtn} from './modules/book-btn';

// Utils
// ---------------------------------
forEachPolyfill();
initIe11Download();


// Modules
// ---------------------------------
programDay();
bookBtn();

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

export const slideDown = (target) => {
    target.classList.add(`active`);
    target.style.height = `auto`;

    const height = target.clientHeight + `px`;

    target.style.height = `0px`;

    setTimeout(() => {
      target.style.height = height;
    }, 0);
}


export const slideUp = (target) => {
  target.style.height = `0px`;
  target.style.paddingTop = `0px`;
  target.style.paddingBottom = `0px`;

  target.addEventListener(`transitionend`, () => {
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.classList.remove(`active`);
  }, {
    once: true
  });
}

export const bookBtn = () => {
  const btnElems = document.querySelectorAll(`.js-book-btn`);

  if (btnElems.length > 0) {
    btnElems.forEach ((elem) => {

      elem.addEventListener(`click`, (evt) => {
        const target = evt.target;
        const txt = evt.target.textContent;

        target.classList.add(`book-btn--loading`);
        target.blur();

        setTimeout(() => {
          target.classList.remove(`book-btn--loading`);
          target.classList.add(`book-btn--success`);
          target.textContent = target.dataset.successTxt;

          setTimeout(() => {
            target.classList.remove(`book-btn--success`);
            target.textContent = txt;
          }, 2000);

        }, 2000);
      });
    });
  }
}

import {slideDown, slideUp} from '../utils/slide';


// const sliderParams = {
//   loop: true,
//   pagination: {
//     el: elem.querySelector(`.swiper-pagination`),
//     type: 'fraction',
//   },
//   breakpoints: {
//     768: {
//       slidesPerView: 2,
//       spaceBetween: 20,
//       navigation: {
//         nextEl: elem.querySelector(`.swiper-button-next`),
//         prevEl: elem.querySelector(`.swiper-button-prev`),
//       },
//     }
//   }
// };


export const programDay = () => {
  const programDayElems = document.querySelectorAll(`.js-program-day`);


    programDayElems.forEach((elem) => {
      const toggleElem = elem.querySelector(`.js-program-day-toggle`);
      const contentElem = elem.querySelector(`.js-program-day-content`);
      const sliderElems = elem.querySelectorAll(`.js-program-day-event-slider`);

      let sliderList = new Set();
      let isOpen = contentElem.classList.contains(`active`);

      const destroyAllSliders = () => {
        for (let slider of sliderList) {
          slider.destroy()
        };

        sliderList = new Set();
      }

      if (window.innerWidth >= 768) {
        sliderElems.forEach((elem) => {
          const slider = new Swiper(elem, {
            loop: true,
            pagination: {
              el: elem.querySelector(`.swiper-pagination`),
              type: 'fraction',
            },
            breakpoints: {
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
                navigation: {
                  nextEl: elem.querySelector(`.swiper-button-next`),
                  prevEl: elem.querySelector(`.swiper-button-prev`),
                },
              }
            }
          });
          sliderList.add(slider);
        });
      }

      toggleElem.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          isOpen = contentElem.classList.contains(`active`);

          if (!isOpen) {
            if (sliderList.size > 0) {
              destroyAllSliders();
            }

            slideDown(contentElem);
            sliderElems.forEach((elem) => {
              const slider = new Swiper(elem, {
                loop: true,
                pagination: {
                  el: elem.querySelector(`.swiper-pagination`),
                  type: 'fraction',
                },
                breakpoints: {
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    navigation: {
                      nextEl: elem.querySelector(`.swiper-button-next`),
                      prevEl: elem.querySelector(`.swiper-button-prev`),
                    },
                  },
                  1360: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  }
                }
              });
              sliderList.add(slider);
            });
          } else {
            slideUp(contentElem);
            destroyAllSliders();
          }
        }
      });
    });
}
