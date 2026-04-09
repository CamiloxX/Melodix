// ============================================================
// Constantes de contenido — Melodix Landing Page
// ============================================================

/** URL de invitación del bot. Reemplaza TU_CLIENT_ID con el real. */
export const INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=TU_CLIENT_ID&permissions=8&scope=bot%20applications.commands";

export const DOCS_URL = "#";
export const SUPPORT_URL = "#";

// ---- Navegación ----
export const NAV_LINKS = [
  { label: "Funciones", href: "#features" },
  { label: "Comandos", href: "#commands" },
  { label: "Plataformas", href: "#platforms" },
  { label: "FAQ", href: "#faq" },
];

// ---- Stats del hero ----
export const STATS = [
  { value: "500+", label: "Servidores activos" },
  { value: "1M+", label: "Canciones reproducidas" },
  { value: "99.9%", label: "Tiempo activo" },
];

// ---- Funciones ----
export interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "Globe2",
    title: "Multi-plataforma",
    description:
      "Compatible con YouTube, Spotify, SoundCloud, Bandcamp, Twitch y URLs de audio HTTP. Una sola herramienta para todas tus fuentes favoritas.",
    gradient: "from-violet-500/20 to-purple-600/10",
  },
  {
    icon: "ListMusic",
    title: "Cola avanzada",
    description:
      "Gestiona playlists completas, mezcla el orden, elimina canciones específicas o limpia toda la cola con un solo comando.",
    gradient: "from-pink-500/20 to-rose-600/10",
  },
  {
    icon: "Terminal",
    title: "Slash Commands",
    description:
      "Comandos slash nativos de Discord: autocompletado, descripciones y validación integrada. Sin prefijos ni configuración.",
    gradient: "from-cyan-500/20 to-blue-600/10",
  },
  {
    icon: "Sparkles",
    title: "Resolución inteligente",
    description:
      "Pega un enlace de Spotify y Melodix busca automáticamente la mejor versión disponible. Sin ripping, sin trucos, todo legal.",
    gradient: "from-amber-500/20 to-orange-600/10",
  },
  {
    icon: "Zap",
    title: "Rápido y estable",
    description:
      "Construido sobre Lavalink, el motor de audio más potente para Discord. Reproducción fluida, sin cortes ni retrasos.",
    gradient: "from-green-500/20 to-emerald-600/10",
  },
  {
    icon: "Users",
    title: "Por servidor",
    description:
      "Cada servidor tiene su propia cola independiente. Multiples comunidades, múltiples sesiones, todo en paralelo sin interferencias.",
    gradient: "from-violet-500/20 to-indigo-600/10",
  },
];

// ---- Cómo funciona ----
export interface Step {
  number: string;
  icon: string;
  title: string;
  description: string;
}

export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    number: "01",
    icon: "PlusCircle",
    title: "Invita el bot",
    description:
      "Haz clic en el botón de invitación, selecciona tu servidor y otorga los permisos necesarios. Tarda menos de 30 segundos.",
  },
  {
    number: "02",
    icon: "Headphones",
    title: "Entra al canal de voz",
    description:
      "Únete a cualquier canal de voz de tu servidor. Melodix se conectará automáticamente cuando uses el primer comando.",
  },
  {
    number: "03",
    icon: "Search",
    title: "Usa /play",
    description:
      "Escribe /play seguido del nombre de la canción, artista o pega directamente un enlace de cualquier plataforma soportada.",
  },
  {
    number: "04",
    icon: "Music2",
    title: "¡Disfruta!",
    description:
      "La música empieza en segundos. Gestiona la cola, ajusta el volumen y controla la reproducción con comandos simples.",
  },
];

// ---- Comandos ----
export interface Command {
  name: string;
  usage: string;
  description: string;
  example?: string;
}

export const COMMANDS: Command[] = [
  {
    name: "play",
    usage: "/play <canción o URL>",
    description: "Reproduce una canción o añade a la cola. Acepta texto de búsqueda, URLs de YouTube, Spotify, SoundCloud y más.",
    example: "/play Bohemian Rhapsody",
  },
  {
    name: "queue",
    usage: "/queue [página]",
    description: "Muestra la cola de reproducción completa con duración de cada canción y duración total.",
    example: "/queue",
  },
  {
    name: "nowplaying",
    usage: "/nowplaying",
    description: "Muestra la canción en reproducción con barra de progreso, volumen y fuente.",
    example: "/nowplaying",
  },
  {
    name: "skip",
    usage: "/skip [cantidad]",
    description: "Salta la canción actual o varias canciones de golpe. Ideal para playlists largas.",
    example: "/skip 3",
  },
  {
    name: "pause",
    usage: "/pause",
    description: "Pausa la reproducción. La canción se retoma exactamente donde quedó.",
  },
  {
    name: "shuffle",
    usage: "/shuffle",
    description: "Mezcla aleatoriamente todas las canciones en la cola.",
  },
  {
    name: "stop",
    usage: "/stop",
    description: "Detiene la reproducción y limpia la cola. El bot permanece en el canal.",
  },
];

// ---- Plataformas ----
// Los logos SVG reales están en components/ui/PlatformLogos.tsx
// Esta interfaz se mantiene por si se necesita en otros lugares
export interface Platform {
  name: string;
  color: string;
  bgColor: string;
  description: string;
}

export const PLATFORMS: Platform[] = [
  { name: "YouTube",       color: "#FF0000", bgColor: "rgba(255,0,0,0.1)",     description: "Links directos y búsquedas" },
  { name: "YouTube Music", color: "#FF0000", bgColor: "rgba(255,0,0,0.1)",     description: "Búsquedas optimizadas" },
  { name: "Spotify",       color: "#1DB954", bgColor: "rgba(29,185,84,0.1)",   description: "Tracks, álbumes y playlists" },
  { name: "SoundCloud",    color: "#FF5500", bgColor: "rgba(255,85,0,0.1)",    description: "Links y búsquedas" },
  { name: "Bandcamp",      color: "#1DA0C3", bgColor: "rgba(29,160,195,0.1)",  description: "Links directos" },
  { name: "Twitch",        color: "#9146FF", bgColor: "rgba(145,70,255,0.1)",  description: "Streams en vivo" },
];

// ---- FAQ ----
export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "¿Cómo invito a Melodix a mi servidor?",
    answer:
      "Haz clic en el botón 'Invitar Bot' en esta página, inicia sesión en Discord si es necesario, selecciona tu servidor de la lista y acepta los permisos solicitados. El bot estará disponible inmediatamente.",
  },
  {
    question: "¿Melodix es completamente gratuito?",
    answer:
      "Sí, Melodix es completamente gratuito. Todas las funciones descritas en esta página están disponibles sin costo alguno. No hay planes de pago, suscripciones ni límites ocultos.",
  },
  {
    question: "¿Qué plataformas de música soporta?",
    answer:
      "Melodix es compatible con YouTube, YouTube Music, SoundCloud, Bandcamp y Twitch. Para Spotify, lee la metadata (nombres de canciones, artistas, playlists) y busca el audio equivalente en YouTube Music, lo que garantiza una experiencia sin interrupciones.",
  },
  {
    question: "¿Qué permisos necesita el bot?",
    answer:
      "Melodix necesita: Conectar (unirse a canales de voz), Hablar (reproducir audio), Enviar mensajes, Insertar enlaces y Ver canales. Todos son estándar para un bot de música. No solicita acceso a mensajes privados ni a información personal.",
  },
  {
    question: "¿Cómo empiezo a reproducir música?",
    answer:
      "Únete a un canal de voz, luego escribe /play seguido del nombre de la canción o pega una URL. Por ejemplo: /play Never Gonna Give You Up o /play https://www.youtube.com/watch?v=.... El bot se unirá al canal y empezará a reproducir.",
  },
  {
    question: "¿Funciona en múltiples servidores a la vez?",
    answer:
      "Sí. Melodix puede atender múltiples servidores simultáneamente, con colas completamente independientes en cada uno. Lo que pasa en un servidor no afecta a otro.",
  },
];
