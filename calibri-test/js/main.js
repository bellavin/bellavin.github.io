objectFit.polyfill({
    selector: 'img',
    fittype: 'cover',
    disableCrossDomain: 'true'
});

$('.card__text').readmore({
    speed: 500,
    moreLink: '<a href="#" class="card__read-more link">Читать дальше</a>',
    lessLink: '<a href="#" class="card__read-more link">Скрыть</a>'
});