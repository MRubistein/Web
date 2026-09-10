/**
 * Te quiero, Tilly — Datos editables
 * 
 * Edita este archivo para actualizar el contenido de la página.
 * No necesitas tocar tilly.js ni tilly.html para cambiar textos,
 * añadir intentos o actualizar la votación.
 */
window.TILLY_DATA = {

    /* ───── Estado actual ───── */
    currentDay: 11,
    currentAttempt: 5,
    totalAttempts: 12,

    /* ───── Redes sociales ───── */
    socialLinks: {
        instagram: "https://www.instagram.com/mateorubistein/",
        tiktok: "https://www.tiktok.com/@mateorubistein",
        youtube: "https://www.youtube.com/@mateorubistein"
    },

    /* ───── Compartir ───── */
    shareText: "Le he dicho a Mateo que deje de hacer caso a ChatGPT. A ver si me escucha.",
    shareUrl: "https://www.mateorubistein.com/spanish/tilly.html",

    /* ───── Votación actual ───── */
    poll: {
        question: "HOY NECESITO DECIDIR UNA COSA.",
        context: "ChatGPT dice que debería ensayar exactamente lo que voy a decir.",
        dilemma: "Yo creo que si preparo cada frase voy a dejar de parecer yo.",
        questionShort: "¿QUÉ HAGO?",
        optionA: {
            id: "a",
            text: "HAGO EXACTAMENTE LO QUE DICE CHATGPT"
        },
        optionB: {
            id: "b",
            text: "LO HAGO A MI MANERA"
        },
        isOpen: true,
        resultTextA: "Que siga el plan de ChatGPT.",
        resultTextB: "Que siga siendo él.",
        /* Votos mock — se usan hasta que conectes Supabase */
        mockVotesA: 120,
        mockVotesB: 198
    },

    /* ───── Intentos ───── */
    attempts: [
        {
            id: 1,
            day: 1,
            attemptNumber: 1,
            date: "28 ago 2026",
            title: "Cambié mi forma de presentarme",
            description: "ChatGPT dijo que mi presentación era demasiado directa. Que sonara más natural. Ensayé tres veces delante del espejo.",
            poster: "../assets/img/tilly/portadatilly.jpg",
            video: null,
            chatGPTAdvice: "\"Presenta tu mejor versión antes de ser tú mismo.\"",
            didIt: true,
            result: "Me sentí como otro. Probablemente ese era el punto.",
            status: "completed",
            socialLinks: {
                youtube: "#",
                tiktok: "#",
                instagram: "#"
            },
            pollResult: {
                votesA: 45,
                votesB: 55,
                winner: "b",
                winnerText: "Que siga siendo él."
            }
        },
        {
            id: 2,
            day: 3,
            attemptNumber: 2,
            date: "30 ago 2026",
            title: "Aprendí a escuchar (según la IA)",
            description: "Me enseñó técnicas de escucha activa. Asentir, parafrasear, no interrumpir. Lo básico, pero dicho por una máquina.",
            poster: "../assets/img/tilly/portadatilly.jpg",
            video: null,
            chatGPTAdvice: "\"Repite lo que ella dice con tus propias palabras para demostrar que la escuchas.\"",
            didIt: true,
            result: "Asentí tanto que parecía un muñeco de dashboard.",
            status: "completed",
            socialLinks: {
                youtube: "#",
                tiktok: "#",
                instagram: "#"
            },
            pollResult: {
                votesA: 62,
                votesB: 38,
                winner: "a",
                winnerText: "Que haga caso a ChatGPT."
            }
        },
        {
            id: 3,
            day: 5,
            attemptNumber: 3,
            date: "1 sep 2026",
            title: "Escribí una carta (que no envié)",
            description: "ChatGPT me ayudó a escribir una carta. La reescribimos siete veces. Al final no se parecía a nada que yo diría.",
            poster: "../assets/img/tilly/portadatilly.jpg",
            video: null,
            chatGPTAdvice: "\"Escribe desde la vulnerabilidad. Pero con estructura.\"",
            didIt: false,
            result: "La carta era perfecta. Demasiado perfecta. La guardé en un cajón.",
            status: "completed",
            socialLinks: {
                youtube: "#",
                tiktok: "#",
                instagram: "#"
            },
            pollResult: {
                votesA: 33,
                votesB: 67,
                winner: "b",
                winnerText: "Que siga siendo él."
            }
        },
        {
            id: 4,
            day: 8,
            attemptNumber: 4,
            date: "4 sep 2026",
            title: "Cambié mi forma de vestir",
            description: "Le pedí consejo sobre qué ropa transmite confianza y calidez al mismo tiempo. Me mandó una lista de básicos.",
            poster: "../assets/img/tilly/portadatilly.jpg",
            video: null,
            chatGPTAdvice: "\"Los colores tierra transmiten cercanía. Evita el negro total.\"",
            didIt: true,
            result: "Parezco alguien que va a una primera cita perpetua. No sé si eso es bueno.",
            status: "completed",
            socialLinks: {
                youtube: "#",
                tiktok: "#",
                instagram: "#"
            },
            pollResult: {
                votesA: 51,
                votesB: 49,
                winner: "a",
                winnerText: "Que haga caso a ChatGPT."
            }
        },
        {
            id: 5,
            day: 11,
            attemptNumber: 5,
            date: "7 sep 2026",
            title: "ChatGPT me dijo que cambiara mi forma de hablar",
            description: "Dice que mi tono es demasiado intenso. Que debería ser más ligero, más casual. Que la gente se asusta menos si pareces despreocupado.",
            poster: "../assets/img/tilly/portadatilly.jpg",
            video: {
                platform: "youtube",
                embedId: "dQw4w9WgXcQ",
                externalUrl: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
                youtubeUrl: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
                tiktokUrl: "#",
                instagramUrl: "#"
            },
            chatGPTAdvice: "\"Habla como si no te importara demasiado. La intensidad se percibe como presión.\"",
            didIt: null,
            result: "Todavía no lo sé.",
            status: "current",
            socialLinks: {
                youtube: "https://www.youtube.com/shorts/dQw4w9WgXcQ",
                tiktok: "#",
                instagram: "#"
            },
            pollResult: null
        }
        /*
         * Para añadir un intento nuevo, copia la estructura de arriba y cambia:
         * - id, day, attemptNumber, date, title, description
         * - poster (ruta a la imagen del intento)
         * - video (null si no tiene, o { platform, embedId, externalUrl, ... })
         * - chatGPTAdvice, didIt (true/false/null), result
         * - status: "completed", "current", "next", o "locked"
         * - socialLinks y pollResult
         *
         * Los intentos que faltan (6-12) se renderizan automáticamente como "locked"
         * según totalAttempts.
         */
    ]
};
