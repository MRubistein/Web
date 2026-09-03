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

        // 4. Lightbox Vanilla nativo sin jQuery (soporte para fotos individuales y galería con flechas, teclado y swipe)
        function initVanillaLightbox() {
            var triggers = document.querySelectorAll('.portfolio, .portfolio-box');
            if (!triggers.length) return;

            var overlay = document.getElementById('mrLightbox');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'mrLightbox';
                overlay.className = 'vanilla-lightbox';
                overlay.setAttribute('role', 'dialog');
                overlay.setAttribute('aria-modal', 'true');
                overlay.setAttribute('aria-label', 'Visor de imagen');
                overlay.innerHTML =
                    '<button class="vanilla-lightbox-close" aria-label="Cerrar">&times;</button>' +
                    '<button class="vanilla-lightbox-prev" aria-label="Anterior">&#10094;</button>' +
                    '<div class="vanilla-lightbox-content">' +
                        '<img class="vanilla-lightbox-img" src="" alt="Mateo Rubistein" />' +
                    '</div>' +
                    '<button class="vanilla-lightbox-next" aria-label="Siguiente">&#10095;</button>';
                document.body.appendChild(overlay);
            }

            var imgEl = overlay.querySelector('.vanilla-lightbox-img');
            var prevBtn = overlay.querySelector('.vanilla-lightbox-prev');
            var nextBtn = overlay.querySelector('.vanilla-lightbox-next');
            var closeBtn = overlay.querySelector('.vanilla-lightbox-close');

            var currentList = [];
            var currentIndex = 0;

            function updateImage() {
                if (!currentList.length) return;
                var currentItem = currentList[currentIndex];
                var src = currentItem.getAttribute('href') || currentItem.getAttribute('data-src');
                var childImg = currentItem.querySelector('img');
                var alt = (childImg && childImg.getAttribute('alt')) || 'Mateo Rubistein';
                imgEl.src = src;
                imgEl.alt = alt;
            }

            function openLightbox(list, index) {
                currentList = list;
                currentIndex = index;
                updateImage();
                overlay.classList.add('active');
                document.body.classList.add('lightbox-open');
                if (currentList.length > 1) {
                    prevBtn.style.display = 'flex';
                    nextBtn.style.display = 'flex';
                } else {
                    prevBtn.style.display = 'none';
                    nextBtn.style.display = 'none';
                }
            }

            function closeLightbox() {
                overlay.classList.remove('active');
                document.body.classList.remove('lightbox-open');
                imgEl.src = '';
            }

            function nextImage() {
                if (currentList.length <= 1) return;
                currentIndex = (currentIndex + 1) % currentList.length;
                updateImage();
            }

            function prevImage() {
                if (currentList.length <= 1) return;
                currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
                updateImage();
            }

            // Delegación de clic para fotos de galería (.portfolio)
            var portfolioElements = Array.prototype.slice.call(document.querySelectorAll('.portfolio'));
            portfolioElements.forEach(function (el, idx) {
                el.addEventListener('click', function (e) {
                    e.preventDefault();
                    openLightbox(portfolioElements, idx);
                });
            });

            // Delegación de clic para fotos individuales (.portfolio-box)
            var singleBoxElements = Array.prototype.slice.call(document.querySelectorAll('.portfolio-box'));
            singleBoxElements.forEach(function (el) {
                el.addEventListener('click', function (e) {
                    e.preventDefault();
                    openLightbox([el], 0);
                });
            });

            // Botones de acción
            closeBtn.addEventListener('click', closeLightbox);
            nextBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                nextImage();
            });
            prevBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                prevImage();
            });

            // Cerrar al hacer clic en el fondo exterior
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay || e.target.classList.contains('vanilla-lightbox-content')) {
                    closeLightbox();
                }
            });

            // Navegación accesible con teclado
            document.addEventListener('keydown', function (e) {
                if (!overlay.classList.contains('active')) return;
                if (e.key === 'Escape' || e.keyCode === 27) closeLightbox();
                if (e.key === 'ArrowRight' || e.keyCode === 39) nextImage();
                if (e.key === 'ArrowLeft' || e.keyCode === 37) prevImage();
            });

            // Gestos táctiles (Swipe izquierda / derecha en móviles)
            var touchStartX = 0;
            overlay.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            overlay.addEventListener('touchend', function (e) {
                var touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) {
                    nextImage();
                } else if (touchEndX - touchStartX > 50) {
                    prevImage();
                }
            }, { passive: true });
        }
        initVanillaLightbox();
    }

    // Ejecutar de inmediato o cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSite);
    } else {
        initSite();
    }
})();
