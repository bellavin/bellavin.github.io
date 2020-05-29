// Липкое меню

var menuElem = document.querySelector('.top-menu');
var menuElemTop = menuElem.offsetTop;

function stickMenu() {
  if (window.pageYOffset > menuElemTop) {
    var isSticky = menuElem.classList.contains('top-menu__sticky');
    var menuHeight = menuElem.offsetHeight; // Считаем здесь а не в условии ниже, чтоб все красиво работало при ресайзе

    if (!isSticky) {
      menuElem.classList.add('top-menu__sticky');
      menuElem.parentElement.style.paddingTop = menuHeight + 'px';
    }
  } else {
    menuElem.classList.remove('top-menu__sticky');
    menuElem.parentElement.style.paddingTop = 0;
  }
}

window.addEventListener('scroll', function() {
  stickMenu();
});


// Переключатель фильтра на мобилке
var filterFormElem = document.querySelector('.filter');
var filterToggleElem = document.querySelector('.filter__mobile-toggle');

filterToggleElem.addEventListener('click', function(evt) {
  evt.preventDefault();
  filterFormElem.classList.toggle('filter--mobile-open')
});


// Переключатель меню на мобилке
var topMenuElem = document.querySelector('.top-menu');
var topMenuToggleElem = document.querySelector('.top-menu__mobile-toggle');

topMenuToggleElem.addEventListener('click', function(evt) {
  evt.preventDefault();
  topMenuElem.classList.toggle('top-menu--mobile-open')
});


// Кастомный селект

new NativejsSelect({
  selector: '.customSelect'
});
