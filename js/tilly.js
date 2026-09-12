/**
 * Te quiero, Tilly — Lógica de la página (simplificada)
 * 
 * - Hero: texto estático
 * - Roadmap: caminito con círculos
 * - Mateo vs Mateo IA: votación con localStorage
 * - Redes sociales: enlaces dinámicos
 * - Disclaimer: toggle al fondo
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
    function show(el) { if (el) el.classList.add("is-visible"); }
    function hide(el) { if (el) el.classList.remove("is-visible"); }

    /* ═══════════════════════════════════════════════════
       1. ROADMAP
       ═══════════════════════════════════════════════════ */

    function initRoadmap() {
        var path = $("#tilly-roadmap-path");
        if (!path || !DATA.roadmap) return;

        var html = "";
        for (var i = 0; i < DATA.roadmap.length; i++) {
            var step = DATA.roadmap[i];
            var stepNum = i + 1;
            var isActive = stepNum === DATA.currentPhase;
            var isDone = stepNum < DATA.currentPhase;

            var cls = "tilly-roadmap__step";
            if (isActive) cls += " tilly-roadmap__step--active";
            if (isDone) cls += " tilly-roadmap__step--done";

            html += '<div class="' + cls + '">';
            html += '  <div class="tilly-roadmap__circle">' + stepNum + '</div>';
            html += '  <span class="tilly-roadmap__step-label">' + step.label + '</span>';
            html += '</div>';
        }
        path.innerHTML = html;
    }

    /* ═══════════════════════════════════════════════════
       2. MATEO VS MATEO IA — Votación
       ═══════════════════════════════════════════════════ */

    var VS_STORAGE_KEY = "tilly_vs_vote_v1";

    function submitVsVote(option) {
        return new Promise(function (resolve) {
            var votesReal = DATA.vsVote.mockVotesReal;
            var votesAI = DATA.vsVote.mockVotesAI;
            if (option === "real") votesReal++;
            else votesAI++;

            var result = { votesReal: votesReal, votesAI: votesAI, voted: option };
            localStorage.setItem(VS_STORAGE_KEY, JSON.stringify(result));

            setTimeout(function () { resolve(result); }, 200);
        });
    }

    function getVsResults() {
        var stored = localStorage.getItem(VS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    }

    function initVsVote() {
        var vs = DATA.vsVote;
        if (!vs) return;

        /* Cargar imágenes y labels */
        var imgReal = $("#tilly-vs-img-real");
        var imgAI = $("#tilly-vs-img-ai");
        var labelReal = $("#tilly-vs-label-real");
        var labelAI = $("#tilly-vs-label-ai");

        if (imgReal) imgReal.src = vs.imageReal;
        if (imgAI) imgAI.src = vs.imageAI;
        if (labelReal) labelReal.textContent = vs.labelReal;
        if (labelAI) labelAI.textContent = vs.labelAI;

        /* Botones */
        var btnReal = $("#tilly-vote-real");
        var btnAI = $("#tilly-vote-ai");
        var buttonsEl = $("#tilly-vs-buttons");
        var resultEl = $("#tilly-vs-result");

        if (btnReal) btnReal.textContent = vs.labelReal;
        if (btnAI) btnAI.textContent = vs.labelAI;

        /* Comprobar si ya votó */
        var existing = getVsResults();
        if (existing) {
            showVsResults(existing);
            return;
        }

        /* Manejar votos */
        function handleVote(option) {
            if (btnReal) btnReal.disabled = true;
            if (btnAI) btnAI.disabled = true;

            submitVsVote(option).then(function (result) {
                showVsResults(result);
            });
        }

        if (btnReal) btnReal.addEventListener("click", function () { handleVote("real"); });
        if (btnAI) btnAI.addEventListener("click", function () { handleVote("ai"); });

        function showVsResults(result) {
            if (buttonsEl) buttonsEl.style.display = "none";
            show(resultEl);

            var total = result.votesReal + result.votesAI;
            var pctReal = total > 0 ? Math.round((result.votesReal / total) * 100) : 0;
            var pctAI = total > 0 ? Math.round((result.votesAI / total) * 100) : 0;

            var barReal = $("#tilly-vs-bar-real");
            var barAI = $("#tilly-vs-bar-ai");
            var pctRealEl = $("#tilly-vs-pct-real");
            var pctAIEl = $("#tilly-vs-pct-ai");
            var labelRealResult = $("#tilly-vs-result-label-real");
            var labelAIResult = $("#tilly-vs-result-label-ai");
            var totalEl = $("#tilly-vs-total");

            if (labelRealResult) labelRealResult.textContent = vs.labelReal;
            if (labelAIResult) labelAIResult.textContent = vs.labelAI;
            if (pctRealEl) pctRealEl.textContent = pctReal + "%";
            if (pctAIEl) pctAIEl.textContent = pctAI + "%";
            if (totalEl) totalEl.textContent = total + " votos";

            requestAnimationFrame(function () {
                if (barReal) barReal.style.width = pctReal + "%";
                if (barAI) barAI.style.width = pctAI + "%";
            });
        }
    }

    /* ═══════════════════════════════════════════════════
       3. REDES SOCIALES
       ═══════════════════════════════════════════════════ */

    function initSocial() {
        var links = DATA.socialLinks;
        if (!links) return;

        var igLink = $("#tilly-link-ig");
        var tkLink = $("#tilly-link-tk");
        var ytLink = $("#tilly-link-yt");

        if (igLink && links.instagram) igLink.href = links.instagram;
        if (tkLink && links.tiktok) tkLink.href = links.tiktok;
        if (ytLink && links.youtube) ytLink.href = links.youtube;
    }

    /* ═══════════════════════════════════════════════════
       4. DISCLAIMER
       ═══════════════════════════════════════════════════ */

    function initDisclaimer() {
        var btn = $("#tilly-disclaimer-btn");
        var content = $("#tilly-disclaimer-content");
        if (!btn || !content) return;

        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            content.classList.toggle("is-visible");
        });

        document.addEventListener("click", function () {
            hide(content);
        });

        content.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }

    /* ═══════════════════════════════════════════════════
       INIT
       ═══════════════════════════════════════════════════ */

    function init() {
        initRoadmap();
        initVsVote();
        initSocial();
        initDisclaimer();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
