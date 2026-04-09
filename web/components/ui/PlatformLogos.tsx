/**
 * Logos SVG reales de cada plataforma musical.
 * Rutas SVG basadas en los brand assets oficiales (simple-icons).
 * Cada componente acepta className para controlar tamaño desde fuera.
 */

interface LogoProps {
  className?: string;
}

export function YouTubeLogo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="YouTube"
    >
      <path
        fill="#FF0000"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
      />
      <path
        fill="#ffffff"
        d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      />
    </svg>
  );
}

export function YouTubeMusicLogo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="YouTube Music"
    >
      {/* Círculo rojo de fondo */}
      <circle cx="12" cy="12" r="12" fill="#FF0000" />
      {/* Círculo blanco interior */}
      <circle cx="12" cy="12" r="4.5" fill="#ffffff" />
      {/* Triángulo de play */}
      <path fill="#FF0000" d="M10.5 9.5l5 2.5-5 2.5V9.5z" />
      {/* Nota musical (línea decorativa) */}
      <path
        fill="#ffffff"
        fillOpacity="0.9"
        d="M12 3.5C7.306 3.5 3.5 7.306 3.5 12S7.306 20.5 12 20.5 20.5 16.694 20.5 12 16.694 3.5 12 3.5zm0 1.5c3.866 0 7 3.134 7 7s-3.134 7-7 7-7-3.134-7-7 3.134-7 7-7z"
      />
    </svg>
  );
}

export function SpotifyLogo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Spotify"
    >
      <path
        fill="#1DB954"
        d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
      />
    </svg>
  );
}

export function SoundCloudLogo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SoundCloud"
    >
      <path
        fill="#FF5500"
        d="M1.175 12.225c-.015 0-.024.013-.024.032l.235 1.55-.235 1.538c0 .019.01.031.024.031.013 0 .023-.012.023-.031L1.39 13.807l-.192-1.55c0-.02-.01-.032-.023-.032zm.58-.19c-.015 0-.024.013-.024.032l.27 1.74-.27 1.727c0 .019.01.031.024.031.014 0 .024-.012.024-.031l.306-1.727-.306-1.74c0-.02-.01-.032-.024-.032zm.57-.14c-.014 0-.025.014-.025.032l.302 1.88-.302 1.866c0 .018.011.031.025.031.014 0 .025-.013.025-.031l.342-1.866-.342-1.88c0-.018-.011-.032-.025-.032zm.572-.083c-.014 0-.026.014-.026.032l.334 1.963-.334 1.95c0 .018.012.031.026.031.014 0 .026-.013.026-.031l.377-1.95-.377-1.963c0-.018-.012-.032-.026-.032zm.568.006c-.016 0-.028.014-.028.032l.366 1.957-.366 1.942c0 .019.012.031.028.031.015 0 .027-.012.027-.031l.414-1.942-.414-1.957c0-.018-.012-.032-.027-.032zm.572-.083c-.016 0-.028.014-.028.032l.399 2.04-.399 2.028c0 .018.012.03.028.03.015 0 .028-.012.028-.03l.451-2.028-.451-2.04c0-.018-.013-.032-.028-.032zm3.533-1.756a5.475 5.475 0 0 0-3.469 1.242 4.912 4.912 0 0 0-1.537-.251 4.938 4.938 0 0 0-4.938 4.938v.062a2.468 2.468 0 0 0 0 4.936h9.944a3.703 3.703 0 0 0 3.703-3.703 3.703 3.703 0 0 0-3.703-3.703zm8.374-2.5a4.633 4.633 0 0 0-2.25.582 6.172 6.172 0 0 0-12.03 1.92v.052a3.086 3.086 0 0 0 0 6.172h14.28a4.633 4.633 0 0 0 0-9.266v.54z"
      />
    </svg>
  );
}

export function BandcampLogo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bandcamp"
    >
      <path
        fill="#1DA0C3"
        d="M0 18.75l7.437-13.5H24l-7.438 13.5z"
      />
    </svg>
  );
}

export function TwitchLogo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Twitch"
    >
      <path
        fill="#9146FF"
        d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"
      />
    </svg>
  );
}
