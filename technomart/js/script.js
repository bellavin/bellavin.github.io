(function() {
  var link = document.querySelector(".contact-n-map-link");

  var popup = document.querySelector(".modal-write-us");
  var close = popup.querySelector(".modal-close");

  var form = popup.querySelector("form");
  var userName = popup.querySelector(".user-name-input");
  var userMail = popup.querySelector(".user-mail-input");
  var mailText = popup.querySelector(".mail-text-input");
  var storage = undefined;
  // var storage = localStorage.getItem("userName");

  link.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.add("modal-show");

    if (storage) {
      userName.value = storage;
    } else {
      userName.focus();
    }

    userName.focus();
  });

  close.addEventListener("click", function (evt) {
    evt.preventDefault();
    popup.classList.remove("modal-show");
    popup.classList.remove("modal-error");
  });

  form.addEventListener("submit", function (evt) {
    if (!userName.value || !userMail.value || !mailText.value) {
      evt.preventDefault();
      popup.classList.remove("modal-error");
      popup.offsetWidth = popup.offsetWidth;
      popup.classList.add("modal-error");
    } else {
      localStorage.setItem("userName", userName.value);
    }
  });

  window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
      if (popup.classList.contains("modal-show")) {
        popup.classList.remove("modal-show");
        popup.classList.remove("modal-error");
      }
    }
  });

  var mapLink = document.querySelector(".contacts-button-map");

  var mapPopup = document.querySelector(".modal-map");
  var mapClose = mapPopup.querySelector(".modal-close");

  mapLink.addEventListener("click", function (evt) {
    evt.preventDefault();
    mapPopup.classList.add("modal-show");
  });

  mapClose.addEventListener("click", function (evt) {
    evt.preventDefault();
    mapPopup.classList.remove("modal-show");
  });

  window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
      if (mapPopup.classList.contains("modal-show")) {
        mapPopup.classList.remove("modal-show");
      }
    }
  });

  var cartLink = document.querySelectorAll(".buy-modal-link");

  for (var i = 0; i < cartLink.length; i++) {
    var cartPopup = document.querySelector(".modal-add-to-cart");
    var cartClose = cartPopup.querySelector(".modal-close");

    cartLink[i].addEventListener("click", function (evt) {
      evt.preventDefault();
      cartPopup.classList.add("modal-show");
    });

    cartClose.addEventListener("click", function (evt) {
      evt.preventDefault();
      cartPopup.classList.remove("modal-show");
    });

    window.addEventListener("keydown", function (evt) {
      if (evt.keyCode === 27) {
        if (cartPopup.classList.contains("modal-show")) {
        cartPopup.classList.remove("modal-show");
        }
      }
    });
  }
})();