/**
 * Te quiero, Tilly — Lógica de la página
 * 
 * Votación (localStorage → preparado para Supabase)
 * Vídeo lazy-load
 * Compartir (Web Share API + fallback clipboard)
 * Render dinámico desde TILLY_DATA
 */
(function () {
    "use strict";

    var DATA = window.TILLY_DATA;
    if (!DATA) return;

    /* ═══════════════════════════════════════════════════
       UTILIDADES
       ═══════════════════════════════════════════════════ */

    function $(selector, parent) {
        return (parent || document).querySelector(selector);
    }
    function $$(selector, parent) {
        return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
    }
    function show(el) { if (el) el.classList.add("is-visible"); }
    function hide(el) { if (el) el.classList.remove("is-visible"); }

    /* ═══════════════════════════════════════════════════
       VOTACIÓN — Capa de datos
       
       Para conectar Supabase, reemplaza el cuerpo de
       submitVote() y getResults() con fetch().
       ═══════════════════════════════════════════════════ */

    var STORAGE_KEY = "tilly_poll_v" + DATA.currentAttempt;

    /**
     * Envía un voto.
     * @param {"a"|"b"} option
     * @returns {Promise<{votesA: number, votesB: number}>}
     */
    function submitVote(option) {
        return new Promise(function (resolve) {
            /* --- MVP: localStorage + mock --- */
            var votesA = DATA.poll.mockVotesA;
            var votesB = DATA.poll.mockVotesB;
            if (option === "a") votesA++;
            else votesB++;

            var result = { votesA: votesA, votesB: votesB, voted: option };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(result));

            setTimeout(function () { resolve(result); }, 300);
            /* --- Fin MVP --- */

            /* --- Supabase (futuro) ---
            fetch('/api/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attempt: DATA.currentAttempt, option: option })
            })
            .then(function(r) { return r.json(); })
            .then(resolve)
            .catch(function() { resolve(null); });
            --- */
        });
    }

    /**
     * Obtiene los resultados actuales.
     * @returns {Promise<{votesA: number, votesB: number, voted: string}|null>}
     */
    function getResults() {
        return new Promise(function (resolve) {
            /* --- MVP: localStorage --- */
            var stored = localStorage.getItem(STORAGE_KEY);
            resolve(stored ? JSON.parse(stored) : null);
            /* --- Fin MVP --- */
        });
    }

    /* ═══════════════════════════════════════════════════
       HERO
       ═══════════════════════════════════════════════════ */

    function initHero() {
        var counterEl = $("#tilly-counter");
        if (counterEl) {
            counterEl.textContent =
                "DÍA " + DATA.currentDay +
                " · INTENTO " + DATA.currentAttempt +
                " DE " + DATA.totalAttempts;
        }

        /* Disclaimer toggle */
        var disclaimerBtn = $(".tilly-hero__disclaimer");
        var tooltip = $(".tilly-disclaimer-tooltip");
        if (disclaimerBtn && tooltip) {
            disclaimerBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                tooltip.classList.toggle("is-visible");
            });
            document.addEventListener("click", function () {
                hide(tooltip);
            });
        }

        /* Smooth scroll CTAs */
        $$("[data-tilly-scroll]").forEach(function (link) {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                var target = document.getElementById(link.getAttribute("data-tilly-scroll"));
                if (target) {
                    var offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: offset, behavior: "smooth" });
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════════
       VOTACIÓN — UI
       ═══════════════════════════════════════════════════ */

    function initPoll() {
        var poll = DATA.poll;
        var section = $("#tilly-poll");
        if (!section) return;

        /* Rellenar textos */
        var qEl = $(".tilly-poll__question", section);
        var ctxEl = $(".tilly-poll__context", section);
        var dilEl = $(".tilly-poll__dilemma", section);
        var qsEl = $(".tilly-poll__question-short", section);
        var btnA = $("#tilly-poll-a", section);
        var btnB = $("#tilly-poll-b", section);
        var noteEl = $(".tilly-poll__note", section);
        var optionsEl = $(".tilly-poll__options", section);
        var loadingEl = $(".tilly-loading", section);
        var errorEl = $(".tilly-error", section);
        var resultEl = $(".tilly-poll__result", section);
        var closedEl = $(".tilly-poll__closed-msg", section);

        if (qEl) qEl.textContent = poll.question;
        if (ctxEl) ctxEl.textContent = "\"" + poll.context + "\"";
        if (dilEl) dilEl.textContent = "\"" + poll.dilemma + "\"";
        if (qsEl) qsEl.textContent = poll.questionShort;
        if (btnA) btnA.textContent = poll.optionA.text;
        if (btnB) btnB.textContent = poll.optionB.text;

        /* Si la votación está cerrada */
        if (!poll.isOpen) {
            if (optionsEl) optionsEl.style.display = "none";
            if (noteEl) noteEl.style.display = "none";
            show(closedEl);
            showPollResults({
                votesA: poll.mockVotesA,
                votesB: poll.mockVotesB,
                voted: null
            });
            return;
        }

        /* Comprobar si ya votó */
        getResults().then(function (existing) {
            if (existing) {
                showPollResults(existing);
                return;
            }

            /* Manejar clic en opción */
            function handleVote(option) {
                if (btnA) btnA.disabled = true;
                if (btnB) btnB.disabled = true;
                if (optionsEl) optionsEl.style.display = "none";
                if (noteEl) noteEl.style.display = "none";
                show(loadingEl);

                submitVote(option).then(function (result) {
                    hide(loadingEl);
                    if (!result) {
                        show(errorEl);
                        return;
                    }
                    showPollResults(result);
                });
            }

            if (btnA) btnA.addEventListener("click", function () { handleVote("a"); });
            if (btnB) btnB.addEventListener("click", function () { handleVote("b"); });
        });

        function showPollResults(result) {
            if (optionsEl) optionsEl.style.display = "none";
            if (noteEl) noteEl.style.display = "none";
            show(resultEl);

            var total = result.votesA + result.votesB;
            var pctA = total > 0 ? Math.round((result.votesA / total) * 100) : 0;
            var pctB = total > 0 ? Math.round((result.votesB / total) * 100) : 0;

            var votedMsg = $(".tilly-poll__voted-msg", section);
            var votedPct = $(".tilly-poll__voted-pct", section);
            var barFillA = $(".tilly-poll__bar-fill--a", section);
            var barFillB = $(".tilly-poll__bar-fill--b", section);
            var barPctA = $("[data-pct='a']", section);
            var barPctB = $("[data-pct='b']", section);
            var barLabelA = $("[data-bar-label='a']", section);
            var barLabelB = $("[data-bar-label='b']", section);
            var totalEl = $(".tilly-poll__total-votes", section);

            if (result.voted) {
                var votedText = result.voted === "a" ? poll.resultTextA : poll.resultTextB;
                var votedPctVal = result.voted === "a" ? pctA : pctB;
                if (votedMsg) votedMsg.textContent = "HAS VOTADO: " + votedText;
                if (votedPct) votedPct.textContent = votedPctVal + "% piensa lo mismo.";

                /* Mostrar compartir */
                initShare(result);
            } else {
                if (votedMsg) votedMsg.textContent = "RESULTADO";
                if (votedPct) votedPct.textContent = "";
            }

            if (barLabelA) barLabelA.textContent = poll.optionA.text;
            if (barLabelB) barLabelB.textContent = poll.optionB.text;
            if (barPctA) barPctA.textContent = pctA + "%";
            if (barPctB) barPctB.textContent = pctB + "%";
            if (totalEl) totalEl.textContent = total + " votos";

            /* Animar barras */
            requestAnimationFrame(function () {
                if (barFillA) barFillA.style.width = pctA + "%";
                if (barFillB) barFillB.style.width = pctB + "%";
            });
        }
    }

    /* ═══════════════════════════════════════════════════
       COMPARTIR
       ═══════════════════════════════════════════════════ */

    function initShare(voteResult) {
        var section = $("#tilly-share");
        if (!section) return;
        show(section);

        var shareBtn = $("#tilly-share-btn");
        var copyBtn = $("#tilly-copy-btn");
        var feedback = $(".tilly-share__feedback", section);

        var shareText = DATA.shareText;
        var shareUrl = DATA.shareUrl;

        if (shareBtn) {
            shareBtn.addEventListener("click", function () {
                if (navigator.share) {
                    navigator.share({
                        title: "Te quiero, Tilly",
                        text: shareText,
                        url: shareUrl
                    }).catch(function () { /* usuario canceló */ });
                } else {
                    /* Fallback: copiar al portapapeles */
                    copyToClipboard(shareText + " " + shareUrl, feedback);
                }
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener("click", function () {
                copyToClipboard(shareUrl, feedback);
            });
        }
    }

    function copyToClipboard(text, feedbackEl) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                showFeedback(feedbackEl, "Enlace copiado");
            }).catch(function () {
                fallbackCopy(text, feedbackEl);
            });
        } else {
            fallbackCopy(text, feedbackEl);
        }
    }

    function fallbackCopy(text, feedbackEl) {
        var textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            showFeedback(feedbackEl, "Enlace copiado");
        } catch (e) {
            showFeedback(feedbackEl, "No se pudo copiar");
        }
        document.body.removeChild(textarea);
    }

    function showFeedback(el, msg) {
        if (!el) return;
        el.textContent = msg;
        setTimeout(function () { el.textContent = ""; }, 2500);
    }

    /* ═══════════════════════════════════════════════════
       ÚLTIMO INTENTO — Vídeo lazy
       ═══════════════════════════════════════════════════ */

    function initLatestAttempt() {
        var attempt = null;
        for (var i = DATA.attempts.length - 1; i >= 0; i--) {
            if (DATA.attempts[i].status === "current") {
                attempt = DATA.attempts[i];
                break;
            }
        }
        if (!attempt) {
            /* Usar el último completado */
            for (var j = DATA.attempts.length - 1; j >= 0; j--) {
                if (DATA.attempts[j].status === "completed") {
                    attempt = DATA.attempts[j];
                    break;
                }
            }
        }
        if (!attempt) return;

        var section = $("#tilly-latest");
        if (!section) return;

        var labelEl = $(".tilly-latest__attempt-label", section);
        var titleEl = $(".tilly-latest__title", section);
        var descEl = $(".tilly-latest__desc", section);

        if (labelEl) labelEl.textContent = "INTENTO " + String(attempt.attemptNumber).padStart(2, "0");
        if (titleEl) titleEl.textContent = attempt.title;
        if (descEl) descEl.textContent = attempt.description;



        /* Social links */
        var linksContainer = $(".tilly-latest__social-links", section);
        if (linksContainer && attempt.socialLinks) {
            var linksHTML = "";
            if (attempt.socialLinks.youtube && attempt.socialLinks.youtube !== "#") {
                linksHTML += '<a href="' + attempt.socialLinks.youtube + '" target="_blank" rel="noopener" class="tilly-social-link">YouTube</a>';
            }
            if (attempt.socialLinks.tiktok && attempt.socialLinks.tiktok !== "#") {
                linksHTML += '<a href="' + attempt.socialLinks.tiktok + '" target="_blank" rel="noopener" class="tilly-social-link">TikTok</a>';
            }
            if (attempt.socialLinks.instagram && attempt.socialLinks.instagram !== "#") {
                linksHTML += '<a href="' + attempt.socialLinks.instagram + '" target="_blank" rel="noopener" class="tilly-social-link">Instagram</a>';
            }
            linksContainer.innerHTML = linksHTML;
        }

        /* Vídeo lazy */
        initLazyVideo(attempt, section);
    }

    function initLazyVideo(attempt, section) {
        var player = $(".tilly-player", section);
        if (!player) return;

        if (!attempt.video) {
            player.style.display = "none";
            return;
        }

        var posterImg = $(".tilly-player__poster", player);
        var playOverlay = $(".tilly-player__play", player);
        var fallbackLink = $(".tilly-player__fallback", player);

        if (posterImg && attempt.poster) {
            posterImg.src = attempt.poster;
            posterImg.alt = "Intento " + attempt.attemptNumber;
        }

        /* Configurar fallback */
        if (fallbackLink) {
            var extUrl = attempt.video.externalUrl || "#";
            fallbackLink.href = extUrl;
            var platformName = attempt.video.platform === "tiktok" ? "TikTok" : "YouTube";
            fallbackLink.innerHTML = '<span>VER EL INTENTO EN ' + platformName.toUpperCase() + '</span>';
        }

        /* Click → cargar iframe */
        function loadVideo() {
            if (!playOverlay) return;
            playOverlay.style.display = "none";
            if (posterImg) posterImg.style.display = "none";

            var iframe = document.createElement("iframe");
            iframe.setAttribute("allowfullscreen", "");
            iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");

            if (attempt.video.platform === "youtube") {
                iframe.src = "https://www.youtube.com/embed/" + attempt.video.embedId + "?autoplay=1&rel=0";
            } else if (attempt.video.platform === "tiktok") {
                iframe.src = "https://www.tiktok.com/embed/v2/" + attempt.video.embedId;
            }

            iframe.onerror = function () {
                iframe.remove();
                show(fallbackLink);
            };

            /* Timeout para detectar fallos de carga */
            var loadTimeout = setTimeout(function () {
                if (!iframe.contentWindow) {
                    iframe.remove();
                    show(fallbackLink);
                }
            }, 8000);

            iframe.onload = function () {
                clearTimeout(loadTimeout);
            };

            player.appendChild(iframe);
            player.style.cursor = "default";
        }

        player.addEventListener("click", loadVideo, { once: true });
    }





    /* ═══════════════════════════════════════════════════
       CTA FINAL
       ═══════════════════════════════════════════════════ */

    function initCtaFinal() {
        var section = $("#tilly-cta-final");
        if (!section) return;

        var links = DATA.socialLinks;
        var container = $(".tilly-cta-final__links", section);
        if (!container) return;

        var html = "";
        if (links.instagram) {
            html += '<a href="' + links.instagram + '" target="_blank" rel="noopener" class="tilly-cta-final__link">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>' +
                'Instagram</a>';
        }
        if (links.tiktok) {
            html += '<a href="' + links.tiktok + '" target="_blank" rel="noopener" class="tilly-cta-final__link">' +
                '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.84 2.84 0 0 1 .84.13V9.01a6.27 6.27 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.27 6.34 6.34 0 0 0 9.33 21.6a6.34 6.34 0 0 0 6.33-6.33V9.4a8.16 8.16 0 0 0 4.84 1.58V7.53a4.84 4.84 0 0 1-.91-.84z"/></svg>' +
                'TikTok</a>';
        }
        if (links.youtube) {
            html += '<a href="' + links.youtube + '" target="_blank" rel="noopener" class="tilly-cta-final__link">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>' +
                'YouTube</a>';
        }
        container.innerHTML = html;
    }

    /* ═══════════════════════════════════════════════════
       INIT
       ═══════════════════════════════════════════════════ */

    function init() {
        initHero();
        initPoll();
        initLatestAttempt();
        initCtaFinal();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
