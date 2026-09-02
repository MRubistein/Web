/**
 * Scripts de Mateo Rubistein - Web Oficial
 * Sustitución de dependencias de Bootstrap por JavaScript Vanilla nativo
 */
document.addEventListener('DOMContentLoaded', function () {
    "use strict";

    // 1. Barra de navegación móvil (Toggle, cerrar al hacer clic en enlace y cerrar al hacer clic fuera)
    var navbarToggler = document.querySelector('.navbar-toggler');
    var navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function (e) {
            e.stopPropagation();
            navbarCollapse.classList.toggle('show');
            var isExpanded = navbarCollapse.classList.contains('show');
            navbarToggler.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });

        // Cerrar menú al pulsar un enlace
        document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function (e) {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 2. Fondo del navbar con sombra al hacer scroll
    var mainNav = document.getElementById('mainNav');
    if (mainNav) {
        var handleScroll = function () {
            if (window.pageYOffset > 100 || document.documentElement.scrollTop > 100) {
                mainNav.classList.add('navbar-scrolled');
            } else {
                mainNav.classList.remove('navbar-scrolled');
            }
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // 3. Desplazamiento suave para enlaces con ancla interna (#)
    document.querySelectorAll('a.js-scroll-trigger[href*="#"]:not([href="#"])').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            var hashIndex = href.indexOf('#');
            if (hashIndex !== -1) {
                var targetId = href.substring(hashIndex + 1);
                var targetElement = document.getElementById(targetId) || document.querySelector('[name="' + targetId + '"]');
                if (targetElement) {
                    e.preventDefault();
                    var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 72;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 4. Inicialización de lightbox para fotos (Magnific Popup)
    if (window.jQuery && typeof window.jQuery.fn.magnificPopup === 'function') {
        window.jQuery('.portfolio-box').magnificPopup({
            type: 'image'
        });

        window.jQuery('.portfolio').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1]
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
            }
        });
    }
});
