/*
Template Name: Admin Pro Admin
Author: Wrappixel
Email: niravjoshi87@gmail.com
File: js
*/




function mostrarNotificaciones() {
    $(function () {
        $("#notifications").click();
    });
}

function habilitarToolTip() {
    $(function () {
        setTimeout(function () {
            $('[data-toggle="tooltip"]').tooltip();
        }, 1000);
    });
}

function iniciar_pluginCheck() {
    $(function () {
        'use_strict';
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        $('.js-switch').each(function () {
            new Switchery($(this)[0], $(this).data());
        });
    });
}

function cerrarBusqueda() {
    $(function () {
        "use strict";
        //$(".search-box a, .search-box .app-search .srh-btn").on('click', function () {
        $(".app-search").hide(200);
        //});
    });
}

function iniciar_plugins() {




    $(function () {
        "use strict";
        $(function () {
            $(".preloader").fadeOut();
        });
        jQuery(document).on('click', '.mega-dropdown', function (e) {
            e.stopPropagation()
        });

        // ============================================================== 
        // This is for the top header part and sidebar part
        // ==============================================================  
        var set = function () {
            var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
            var topOffset = 0;
            if (width < 1170) {
                $("body").addClass("mini-sidebar");
                $('.navbar-brand span').hide();
                $(".sidebartoggler i").addClass("ti-menu");
            } else {
                $("body").removeClass("mini-sidebar");
                $('.navbar-brand span').show();
            }

            var height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
            height = height - topOffset;
            if (height < 1) height = 1;
            if (height > topOffset) {
                $(".page-wrapper").css("min-height", (height) + "px");
            }

        };
        $(window).ready(set);
        $(window).on("resize", set);

        // ============================================================== 
        // Theme options
        // ==============================================================     
        $(".sidebartoggler").on('click', function () {
            if ($("body").hasClass("mini-sidebar")) {
                $("body").trigger("resize");
                $("body").removeClass("mini-sidebar");
                $('.navbar-brand span').show();

            } else {
                $("body").trigger("resize");
                $("body").addClass("mini-sidebar");
                $('.navbar-brand span').hide();

            }
        });

        // this is for close icon when navigation open in mobile view
        $(".nav-toggler").click(function () {
            $("body").toggleClass("show-sidebar");
            $(".nav-toggler i").toggleClass("ti-menu");
            $(".nav-toggler i").addClass("ti-close");
        });

        $(".search-box a, .search-box .app-search .srh-btn").on('click', function () {
            $(".app-search").toggle(200);
        });
        // ============================================================== 
        // Right sidebar options
        // ============================================================== 
        $(".right-side-toggle").click(function () {
            $(".right-sidebar").slideDown(50);
            $(".right-sidebar").toggleClass("shw-rside");
        });
        // ============================================================== 
        // This is for the floating labels
        // ============================================================== 
        $('.floating-labels .form-control').on('focus blur', function (e) {
            $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
        }).trigger('blur');

        // ============================================================== 
        // Auto select left navbar
        // ============================================================== 
        $(function () {
            var url = window.location;
            var element = $('ul#sidebarnav a').filter(function () {
                return this.href == url;
            })
            //.addClass('active').parent().addClass('active');
            while (true) {
                if (element.is('li')) {
                    element = element.parent().addClass('in').parent()
                    //.addClass('active');
                } else {
                    break;
                }
            }

        });
        // ============================================================== 
        //tooltip
        // ============================================================== 
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
        // ============================================================== 
        //Popover
        // ============================================================== 
        $(function () {
            $('[data-toggle="popover"]').popover()
        })
        // ============================================================== 
        // Sidebarmenu
        // ============================================================== 
        $(function () {
            $('#sidebarnav').AdminMenu();
        });

        // ============================================================== 
        // Perfact scrollbar
        // ============================================================== 
        $('.scroll-sidebar, .right-side-panel, .message-center, .right-sidebar').perfectScrollbar();

        // ============================================================== 
        // Resize all elements
        // ============================================================== 
        $("body").trigger("resize");
        // ============================================================== 
        // To do list
        // ============================================================== 
        $(".list-task li label").click(function () {
            $(this).toggleClass("task-done");
        });



        // ============================================================== 
        // Collapsable cards
        // ==============================================================
        $('a[data-action="collapse"]').on('click', function (e) {
            e.preventDefault();
            $(this).closest('.card').find('[data-action="collapse"] i').toggleClass('ti-minus ti-plus');
            $(this).closest('.card').children('.card-body').collapse('toggle');

        });
        // Toggle fullscreen
        $('a[data-action="expand"]').on('click', function (e) {
            e.preventDefault();
            $(this).closest('.card').find('[data-action="expand"] i').toggleClass('mdi-arrow-expand mdi-arrow-compress');
            $(this).closest('.card').toggleClass('card-fullscreen');
        });

        // Close Card
        $('a[data-action="close"]').on('click', function () {
            $(this).closest('.card').removeClass().slideUp('fast');
        });


        setTimeout(() => {


            if ($("#particles-js").length) {
                if ($(window).width() > 992) {
                    particlesJS("particles-js", {
                        "particles": {
                            "number": {
                                "value": 95,
                                "density": { "enable": true, "value_area": 946.9771699587272 }
                            },
                            "color": { "value": "#ffffff" },
                            "shape": {
                                "type": "circle",
                                "stroke": { "width": 0, "color": "#000000" },
                                "polygon": { "nb_sides": 5 },
                                "image": { "src": "img/github.svg", "width": 100, "height": 100 }
                            },
                            "opacity": {
                                "value": 0.5,
                                "random": false,
                                "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false }
                            },
                            "size": {
                                "value": 3,
                                "random": true,
                                "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false }
                            },
                            "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
                            "move": {
                                "enable": true,
                                "speed": 6,
                                "direction": "none",
                                "random": false,
                                "straight": false,
                                "out_mode": "out",
                                "bounce": false,
                                "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
                            }
                        },
                        "interactivity": {
                            "detect_on": "canvas",
                            "events": {
                                "onhover": { "enable": false, "mode": "repulse" },
                                "onclick": { "enable": false, "mode": "push" },
                                "resize": true
                            },
                            "modes": {
                                "grab": { "distance": 400, "line_linked": { "opacity": 1 } },
                                "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
                                "repulse": { "distance": 200, "duration": 0.4 },
                                "push": { "particles_nb": 4 },
                                //"remove": {"particles_nb": 2}
                            }
                        },
                        "retina_detect": true
                    });
                }
            }


        },100)


        // var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        // $('.js-switch').each(function() {
        //     new Switchery($(this)[0], $(this).data());
        // });





    });
}