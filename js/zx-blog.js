$(function() {
    var navSelector = '#post-toc';
    var $myNav = $("#post-toc");
    Toc.init($myNav);
    $('body').scrollspy({
        target: navSelector
    });
});

// Drop Bootstarp low-performance Navbar
// Use customize navbar with high-quality material design animation
// in high-perf jank-free CSS3 implementation
jQuery(document).ready(function ($) {
    var $toggle = $('.navbar-toggler')
    var $navBar = $('#navbar-zx')
    var $collapse = $('.navbar-collapse')

    $toggle.on('click', handleMagic)

    function handleMagic (e) {
        if ($navBar.hasClass('toggle_in')) {
            // CLOSE
            $navBar.removeClass('toggle_in')
            // wait until animation end.
            setTimeout(function () {
                // prevent frequently toggle
                if (!$navBar.hasClass('toggle_in')) {
                    $collapse.css("height", "0px")
                }
            }, 400)
        } else {
            // OPEN
            $collapse.css("height", "auto")
            $navBar.addClass('toggle_in')
        }
    }
})
// Navigation Scripts to Show Header on Scroll-Up
jQuery(document).ready(function ($) {
    var MQL = 768

    //primary navigation slide-in effect
    if ($(window).width() > MQL) {
        var headerHeight = $('#navbar-zx').height()
        $(window).on('scroll', {
                previousTop: 0
            },
            function () {
                var currentTop = $(window).scrollTop()
                //check if user is scrolling up
                if (currentTop < this.previousTop) {
                    //if scrolling up...
                    if (currentTop > 0 && $('#navbar-zx').hasClass('is-fixed')) {
                        $('#navbar-zx').addClass('is-visible')
                    } else {
                        $('#navbar-zx').removeClass('is-visible is-fixed')
                    }
                } else {
                    //if scrolling down...
                    $('#navbar-zx').removeClass('is-visible')
                    if (currentTop > headerHeight && !$('#navbar-zx').hasClass('is-fixed')) $('#navbar-zx').addClass('is-fixed')
                }
                this.previousTop = currentTop
            })
    }
})