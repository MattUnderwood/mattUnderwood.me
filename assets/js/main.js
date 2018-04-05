/* global $ */

$(function(){
    $(window).scroll(function(){
        if ($(this).scrollTop() > 420) {
            $('.header').addClass('header--sticky');
            $('body').addClass('is-scrolling');
        } else {
            $('.header').removeClass('header--sticky');
            $('body').removeClass('is-scrolling');
        }
    });
});