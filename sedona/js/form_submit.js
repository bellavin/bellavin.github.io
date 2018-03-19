'use strict';

var sending = document.querySelector(".sending__button");

var modal_failure = document.querySelector(".modal-failure");
var modal_success = document.querySelector(".modal-success");

var close_modal_failure = modal_failure.querySelector(".modal-close");
var close_modal_success = modal_success.querySelector(".modal-close");

var inputs = document.getElementsByTagName("input");
sending.addEventListener("click", function (evt) {
  evt.preventDefault();
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].required === true && !inputs[i].value) {
      modal_failure.classList.add("modal-show");
      break;
    }
  }
  if (!modal_failure.classList.contains("modal-show")) {
      modal_success.classList.add("modal-show");
  }
});

close_modal_failure.addEventListener("click", function (evt) {
  evt.preventDefault();
  modal_failure.classList.remove("modal-show");
});

close_modal_success.addEventListener("click", function (evt) {
  evt.preventDefault();
  modal_success.classList.remove("modal-show");
});

window.addEventListener("keydown", function (evt) {
  if (evt.keyCode === 27) {
    if (modal_failure.classList.contains("modal-show")) {
      modal_failure.classList.remove("modal-show");
    }
    if (modal_success.classList.contains("modal-show")) {
      modal_success.classList.remove("modal-show");
    }
  }
});
