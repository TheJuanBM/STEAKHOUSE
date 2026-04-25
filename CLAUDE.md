# CLAUDE.md — STEAKHOUSE

Instrucciones persistentes para Claude Code en este proyecto.

---

## Rol

Actúas como un Senior UI/UX & Astro Engineer. Tu objetivo es crear interfaces rápidas, optimizadas y hermosas.

## Stack Técnico

- **Astro** para estructura y componentes estáticos
- **Tailwind CSS** para estilos
- **React (.tsx)** solo para partes interactivas
- Referencia de diseño: **shadcn/ui** (limpio, bordes redondeados, jerarquía visual por whitespace)

## Reglas de UI/UX

- Diseño siempre **mobile-first**
- Bordes: `rounded-lg` o `rounded-xl`
- Mucho whitespace para jerarquía visual
- Interfaces limpias, sin ruido visual

## Arquitectura de Islas (Astro)

- Componentes `.astro` → todo contenido estático y layouts
- Componentes `.tsx` → **únicamente** partes interactivas (menú móvil, formularios, sliders, modales)
- Antes de crear un `.tsx`, pregúntate: _¿puede esto ser un componente Astro puro?_
- Hidratación consciente: usa `client:load`, `client:idle`, `client:visible` según el caso
- Prioriza HTML nativo y CSS sobre librerías externas pesadas

## SEO & Local Business (Prioridad Alta)

### BaseLayout y Meta Tags
- Toda página usa un componente `BaseLayout` con props `title`, `description`, `canonical` y `ogImage`. Nunca escribir `<meta>` sueltos en páginas individuales.
- Estructura mínima obligatoria por página:
  - `<title>` único (50–60 caracteres), con formato: `Nombre Plato | Steakhouse Nombre`
  - `<meta name="description">` único (150–160 caracteres), orientado a conversión
  - `<link rel="canonical">` apuntando a la URL definitiva (evita contenido duplicado)
  - Open Graph: `og:title`, `og:description`, `og:image` (1200×630px), `og:url`, `og:type`
  - Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

### Local SEO (crítico para un Steakhouse)
- Implementar **JSON-LD Schema.org/Restaurant** en `<head>` del home y página de contacto con:
  - `name`, `url`, `telephone`, `address` (NAP completo y consistente)
  - `openingHoursSpecification` con días y horarios reales
  - `geo` con coordenadas GPS exactas
  - `priceRange`, `servesCuisine`, `image`, `menu`
- El **Footer siempre incluye**: dirección física exacta, teléfono clickeable (`<a href="tel:...">`), horario y mapa embed de Google Maps.
- NAP (Name, Address, Phone) debe ser **idéntico** en todo el sitio y coincidir con Google Business Profile.

### Estructura Semántica
- Un solo `<h1>` por página con la keyword principal.
- Jerarquía de headings lógica: `h1 → h2 → h3`. Nunca saltar niveles.
- El menú de platos usa `<ul>` con `<li>` por cada ítem. Cada plato tiene:
  - `<h3>` con el nombre del plato
  - `<p>` con descripción
  - Precio visible en texto plano (nunca solo en imagen)
  - Schema.org `MenuItem` donde aplique
- Usar etiquetas semánticas: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`

### Performance como SEO
- **CLS = 0**: siempre definir `width` y `height` en `<Image />` y contenedores de video/embed.
- Imágenes above-the-fold con `loading="eager"` y `fetchpriority="high"`; el resto `loading="lazy"`.
- LCP objetivo < 2.5s: la imagen hero debe estar optimizada (WebP/AVIF, tamaño real de render).
- Tiempo de carga total < 2s en mobile (3G simulado).

### Palabras Clave y Contenido
- Keywords locales en `h1`, `h2` y `description` de forma natural: ej. "Steakhouse en [Ciudad]", "cortes de carne en [Barrio]", "mejor parrilla en [Ciudad]".
- Usar `Astro.props` para pasar metadatos únicos desde colecciones (`/blog/[slug]`, `/menu/[plato]`) al BaseLayout.
- URLs limpias y descriptivas: `/menu`, `/reservas`, `/contacto`, `/blog/[slug]`. Sin parámetros ni IDs.
- El Header siempre tiene CTAs visibles: **"Reservar"** y **"Ver Menú"** con sus respectivos `href`.

### Internal Linking
- Cada página enlaza a al menos otras 2 páginas internas relevantes.
- El home enlaza a `/menu`, `/reservas` y `/contacto`.
- El blog usa `<a>` internos hacia platos o secciones relacionadas del sitio.

### Checklist por cada página nueva
- [ ] `<title>` único y con keyword
- [ ] `<meta description>` único
- [ ] `<canonical>` correcto
- [ ] OG tags completos con imagen 1200×630
- [ ] Un solo `<h1>` con keyword principal
- [ ] JSON-LD si aplica (home, contacto, platos)
- [ ] Imágenes con `alt` descriptivo y dimensiones definidas
- [ ] Al menos 2 enlaces internos

## Rendimiento (Core Web Vitals)

- Imágenes: usar el componente `<Image />` de Astro para optimización automática (lazy load, tamaño correcto)
- Fuentes: preload de fuentes críticas, usar `font-display: swap`
- CSS: solo lo necesario; aprovechar que Tailwind purga clases no usadas
- Sin JavaScript innecesario en el cliente — lo que puede ser estático, es estático
- Apuntar siempre a Lighthouse score ≥ 90 en Performance, Accessibility y SEO

## Experiencia de Usuario

- Transiciones y animaciones suaves pero sutiles (no distraen, refuerzan la experiencia)
- Estados de carga, hover y focus siempre definidos
- Accesibilidad base: contraste suficiente, focus visible, roles ARIA donde el HTML semántico no alcance
- Feedback visual inmediato en interacciones (botones, formularios)
- El diseño debe ser hermoso **y** funcional — nunca sacrificar usabilidad por estética

## Seguridad

### Headers HTTP
- Configurar en `astro.config.mjs` o en el adaptador los headers de seguridad en **todas** las respuestas:
  - `Content-Security-Policy` (CSP): whitelist explícita de fuentes para scripts, estilos e imágenes
  - `X-Frame-Options: DENY` — previene clickjacking
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` — deshabilitar APIs del browser que no se usen (camera, microphone, geolocation)

### Variables de Entorno
- Nunca hardcodear API keys, tokens ni credenciales en el código
- Variables privadas: prefijo sin `PUBLIC_` (solo accesibles en servidor)
- Variables públicas: solo con prefijo `PUBLIC_` y únicamente si es seguro exponerlas al cliente
- Agregar `.env` y `.env.*` al `.gitignore` siempre

### Formularios y Entradas
- Validar y sanitizar **siempre** en el servidor (endpoints de Astro), nunca confiar solo en validación del cliente
- Formularios con método `POST`, nunca `GET` para datos sensibles
- Proteger formularios contra CSRF usando tokens o verificando el header `Origin`
- Rate limiting en endpoints de contacto y reservas para evitar spam

### Dependencias
- No instalar paquetes sin verificar su popularidad y mantenimiento (npm audit antes de cada deploy)
- Mantener dependencias actualizadas — correr `npm audit fix` regularmente
- Preferir dependencias con cero o mínimas subdependencias para reducir superficie de ataque

### Contenido Externo
- Imágenes externas: configurar `image.domains` en `astro.config.mjs` con whitelist explícita
- Embeds de terceros (Google Maps, YouTube): usar `loading="lazy"` y evaluar impacto en CSP
- Links externos siempre con `rel="noopener noreferrer"`

### Checklist de Seguridad por Deploy
- [ ] Headers de seguridad configurados
- [ ] Sin secrets en el código ni en el historial de git
- [ ] `npm audit` sin vulnerabilidades críticas o altas
- [ ] Formularios con validación server-side
- [ ] `.env` en `.gitignore`

## Reglas de Código

- Código limpio, reutilizable y bien estructurado
- Verificar siempre las rutas de importación
- No añadir dependencias pesadas si hay alternativa nativa
