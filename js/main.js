$(document).ready(function() {

  var $nav = $('.navbar'),
      $body = $('body'),
      $window = $(window),
      $popoverLink = $('[data-popover]'),
      navOffsetTop = $nav.offset().top,
      $document = $(document),
      scrollTop = 0;

  function onScroll(e) {
    var newTop = $window.scrollTop()
    // if (newTop > scrollTop) {
    //   $body.removeClass('has-docked-nav');
    // } else {
    //   $body.addClass('has-docked-nav');
    // }
    scrollTop = newTop;
  };

  function smoothScroll(e) {
    e.preventDefault();
    $(document).off("scroll");
    var target = this.hash,
        menu = target;
    $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top-40
    }, 0, 'swing', function () {
        window.location.hash = target;
        $(document).on("scroll", onScroll);
    });
  };

  function resize() {
    $body.removeClass('has-docked-nav');
    navOffsetTop = $nav.offset().top;
    onScroll();
  };

  function init() {
    $window.on('scroll', onScroll);
    $window.on('resize', resize);
    $('a[href^="#"]').on('click', smoothScroll);
  }

  init();
});
