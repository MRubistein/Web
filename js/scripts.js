/**
 * Scripts de Mateo Rubistein - Web Oficial
 * JavaScript Vanilla nativo para navegación móvil, scroll y lightboxes
 */
(function () {
    "use strict";

    function initSite() {
        var mainNav = document.getElementById('mainNav');

        // Función para abrir/cerrar el menú móvil
        function toggleNavbarMenu(togglerEl) {
            var targetSelector = (togglerEl && togglerEl.getAttribute('data-target')) || '#navbarResponsive';
            var navCollapse = document.querySelector(targetSelector) || document.querySelector('.navbar-collapse');
            if (!navCollapse) return;

            var isExpanded = navCollapse.classList.toggle('show');
            var togglers = document.querySelectorAll('.navbar-toggler');
            togglers.forEach(function (btn) {
                btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            });
        }

        // Función para cerrar el menú móvil
        function closeNavbarMenu() {
            var collapses = document.querySelectorAll('.navbar-collapse.show');
            collapses.forEach(function (c) {
                c.classList.remove('show');
            });
            var togglers = document.querySelectorAll('.navbar-toggler');
            togglers.forEach(function (btn) {
                btn.setAttribute('aria-expanded', 'false');
            });
        }

        // 1. Manejo del botón hamburguesa con soporte táctil y clic
        var lastToggleTime = 0;
        document.addEventListener('click', function (e) {
            var toggler = e.target.closest('.navbar-toggler, [data-toggle="collapse"]');
            if (toggler) {
                e.preventDefault();
                e.stopPropagation();
                var now = Date.now();
                if (now - lastToggleTime > 250) {
                    lastToggleTime = now;
                    toggleNavbarMenu(toggler);
                }
                return;
            }

            // Cerrar menú al hacer clic en un enlace de navegación
            if (e.target.closest('.navbar-nav .nav-link')) {
                closeNavbarMenu();
                return;
            }

            // Cerrar menú al hacer clic fuera
            var openMenu = document.querySelector('.navbar-collapse.show');
            if (openMenu && !openMenu.contains(e.target)) {
                closeNavbarMenu();
            }
        });

        // Soporte táctil directo para móviles rápidos
        document.querySelectorAll('.navbar-toggler').forEach(function (btn) {
            btn.addEventListener('touchend', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var now = Date.now();
                if (now - lastToggleTime > 250) {
                    lastToggleTime = now;
                    toggleNavbarMenu(btn);
                }
            }, { passive: false });
        });

        // 2. Fondo del navbar con sombra al hacer scroll
        if (mainNav) {
            var handleScroll = function () {
                var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
                if (scrollY > 100) {
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
    }

    // Ejecutar de inmediato o cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSite);
    } else {
        initSite();
    }
})();
