/**
 * Te quiero, Tilly — Datos editables
 * 
 * Edita este archivo para actualizar el contenido de la página.
 * No necesitas tocar tilly.js ni tilly.html para cambiar textos
 * o actualizar las imágenes de Mateo vs Mateo IA.
 */
window.TILLY_DATA = {

    /* ───── Roadmap (3 pasos fijos) ───── */
    currentPhase: 1,          // 1, 2 o 3 → paso activo del roadmap
    roadmap: [
        { label: "IMPRESIONAR A TILLY" },
        { label: "QUE TILLY SEPA QUE EXISTO" },
        { label: "SER EL NOVIO DE TILLY ❤️" }
    ],

    /* ───── Mateo vs Mateo IA ─────
     *
     * Para actualizar con nuevas parejas de imágenes:
     * 1. Añade las imágenes a /assets/img/tilly/
     * 2. Cambia imageReal e imageAI aquí abajo
     * 3. Resetea los votos mock si quieres empezar de cero
     */
    vsVote: {
        imageReal: "../assets/img/tilly/mateo-real.jpg",
        imageAI: "../assets/img/tilly/mateo-ia.jpg",
        labelReal: "MATEO",
        labelAI: "MATEO IA",
        mockVotesReal: 85,
        mockVotesAI: 112
    },

    /* ───── Redes sociales ───── */
    socialLinks: {
        instagram: "https://www.instagram.com/mateorubistein/",
        tiktok: "https://www.tiktok.com/@mateorubistein",
        youtube: "https://www.youtube.com/@mateorubistein"
    }
};
