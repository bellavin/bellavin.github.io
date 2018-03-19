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