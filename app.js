/* =====================================================================
   HELLMED — main.js
   El "CEREBRO" de la página. Vanilla JS (sin librerías).

   ÍNDICE
     0. Datos de personajes (CHARACTERS)
     1. Utilidades ($, $$, toast)
     2. Tema Dark / Light
     3. Navbar (scroll, menú móvil, enlace activo)
     4. Hero: brasas animadas
     5. Catálogo de personajes (tabs + tarjetas + ficha)
     6. Animaciones de aparición (IntersectionObserver)
     7. Modal de autenticación (abrir/cerrar, tabs, foco)
     8. Validación de formularios
     9. Enlaces placeholder + año del footer
    10. init(): arranca todo

   Todo el código vive dentro de una función que se ejecuta sola (IIFE)
   para no "ensuciar" el ámbito global con variables.
   'use strict' hace que JS marque como error malas prácticas comunes.
   ===================================================================== */
(function () {
  'use strict';

  /* ===================================================================
     SUPABASE — conexión (la publishable key es pública, es seguro)
     =================================================================== */
  const SUPABASE_URL = 'https://hmqhchbkbylqywwcxkfn.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_wmMhnh0HGSdkZxexdQsM5g_DXMu1fq5';
  // Si la librería no cargó (sin internet), db queda en null y el resto del sitio sigue funcionando
  const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
  const NO_CONNECTION_MSG = 'Sin conexión: necesitas internet para iniciar sesión o registrarte.';

  // Traduce los errores de Supabase a mensajes claros en español
  function authErrorMessage(error) {
    const msg = (error && error.message ? error.message : '').toLowerCase();
    if (msg.includes('invalid login')) return 'Correo o contraseña incorrectos.';
    if (msg.includes('already registered') || msg.includes('already been registered'))
      return 'Ese correo ya está registrado.';
    if (msg.includes('email not confirmed')) return 'Confirma tu correo antes de entrar.';
    if (msg.includes('rate limit')) return 'Demasiados intentos. Espera un momento.';
    if (msg.includes('database error')) return 'Ese nombre de jugador ya existe. Elige otro.';
    return 'Ocurrió un error. Intenta de nuevo.';
  }

  /* ===================================================================
     0. DATOS DE PERSONAJES
     -------------------------------------------------------------------
     Para AGREGAR un personaje: copia un objeto y cambia sus valores.
     Para poner su SPRITE: guarda la imagen en assets/img/ y escribe la
     ruta en "image" (ej. 'assets/img/cruz.png'). Si "image" está vacío
     se muestran sus iniciales.
     stats: valores de 0 a 100 (se dibujan como barras).
     NOTA: las estadísticas, frases y descripciones de enemigos son de
     EJEMPLO (el documento de diseño solo da sus nombres). Ajústenlas con
     el lore y el balance real del juego.
     =================================================================== */
  const CHARACTERS = {
    heroes: [
      {
        id: 'cruz',
        name: 'Hermano Cruz',
        role: 'Exsacerdote · Paramédico',
        image: '', // AGREGAR AQUÍ el sprite: 'assets/img/hermano-cruz.png'
        quote: 'La fe me dio fuerza. La medicina me dio las manos para usarla.',
        description:
          'Tras ver en una visión la muerte de su esposa, dejó los hábitos para hacerse paramédico. Al salvarla rompió el equilibrio cósmico y los demonios se la llevaron. Ahora combate con la Cruz Consagrada y se cura con su botiquín de primeros auxilios.',
        stats: { Vida: 70, Ataque: 65, Agilidad: 60, Curación: 90 },
        abilities: ['Cruz Consagrada', 'Botiquín de primeros auxilios', 'Doble salto', 'Cántico Sagrado', 'Lanza de Luz']
      },
      {
        id: 'phantom',
        name: 'Phantom',
        role: 'Espíritu guía',
        image: '', // AGREGAR AQUÍ el sprite: 'assets/img/phantom.png'
        quote: 'No pude salvar a mis pacientes. A ti sí te voy a sacar de aquí.',
        description:
          'El espíritu de un médico que murió intentando salvar a sus pacientes. Acompaña al Hermano Cruz: lo advierte de trampas, da pistas, lanza ataques espectrales y lo revive una vez por nivel.',
        stats: { Vida: 40, Ataque: 45, Agilidad: 85, Curación: 75 },
        abilities: ['Aviso de peligro', 'Ataque espectral', 'Pistas', 'Resurrección (1 por nivel)']
      }
    ],
    enemigos: [
      {
        id: 'gargola',
        name: 'La Gárgola',
        role: 'Guardiana de la Catedral en Ruinas',
        image: '', // AGREGAR AQUÍ el sprite: 'assets/img/gargola.png'
        quote: 'La piedra no reza. La piedra espera.',
        description:
          'Estatua profanada que despierta en la Catedral en Ruinas. Ataca en picada desde las alturas: es el primer reto que enseña a esquivar y a contraatacar.',
        stats: { Vida: 55, Ataque: 50, Agilidad: 70, Peligro: 45 },
        abilities: ['Embestida en picada', 'Piel de piedra', 'Vuelo corto']
      },
      {
        id: 'muerte',
        name: 'La Muerte',
        role: 'Cazadora de almas · Ciudad',
        image: '', // AGREGAR AQUÍ el sprite: 'assets/img/muerte.png'
        quote: 'Tú me robaste una vida. Vengo a cobrarla.',
        description:
          'Furiosa porque el Hermano Cruz le arrebató a su esposa, recorre la Ciudad con su guadaña. Se teletransporta entre sombras y drena la vida del jugador.',
        stats: { Vida: 75, Ataque: 85, Agilidad: 65, Peligro: 85 },
        abilities: ['Guadaña segadora', 'Paso sombrío', 'Drenar vida']
      },
      {
        id: 'minotauro',
        name: 'El Minotauro',
        role: 'Bestia del Bosque de las Sombras',
        image: '', // AGREGAR AQUÍ el sprite: 'assets/img/minotauro.png'
        quote: '¡GRRRAAAH!',
        description:
          'Coloso que domina el Bosque de las Sombras. Lento pero devastador: sus cargas rompen el escenario y obligan a usar el doble salto en el momento justo.',
        stats: { Vida: 95, Ataque: 90, Agilidad: 30, Peligro: 90 },
        abilities: ['Carga brutal', 'Pisotón sísmico', 'Furia']
      }
    ]
  };

  /* ===================================================================
     1. UTILIDADES
     =================================================================== */

  // Atajos para buscar elementos: $ devuelve uno, $$ devuelve un arreglo
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // ¿El usuario pidió reducir animaciones en su sistema?
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Muestra una notificación flotante unos segundos
  let toastTimer = null;
  function showToast(message, duration = 3500) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer); // Si ya había uno, reinicia el contador
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), duration);
  }

  // Escapa texto antes de meterlo en innerHTML (evita inyección de HTML / XSS).
  // Los datos son nuestros, pero es buena práctica cuando en el futuro vengan del backend.
  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /* ===================================================================
     2. TEMA DARK / LIGHT
     -------------------------------------------------------------------
     1. Leemos el atributo data-theme de <html>.
     2. Al pulsar el botón lo cambiamos → el CSS usa otras variables.
     3. Guardamos la elección en localStorage para la próxima visita.
     =================================================================== */
  const THEME_KEY = 'hellmed-theme';

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Actualizamos el icono y el texto accesible del botón
    const button = $('#themeToggle');
    const isDark = theme === 'dark';
    $('.theme-icon', button).textContent = isDark ? '☀' : '☾';
    button.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');

    // Color de la barra del navegador en celular
    $('meta[name="theme-color"]').setAttribute('content', isDark ? '#0b0708' : '#f5f0ea');
  }

  function initTheme() {
    applyTheme(getTheme()); // Sincroniza el icono con el tema actual

    $('#themeToggle').addEventListener('click', () => {
      const next = getTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* Navegación privada: no se guarda, pero el cambio funciona */
      }
    });
  }

  /* ===================================================================
     3. NAVBAR
     =================================================================== */
  function initNavbar() {
    const navbar = $('#navbar');
    const burger = $('#burger');
    const menu = $('#navMenu');

    // --- 3.1 Fondo sólido al hacer scroll ---
    const onScroll = () => navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    onScroll(); // Por si la página carga ya desplazada
    window.addEventListener('scroll', onScroll, { passive: true }); // passive = mejor rendimiento

    // --- 3.2 Menú hamburguesa (celular) ---
    function setMenu(open) {
      menu.classList.toggle('is-open', open);
      navbar.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('no-scroll', open);
    }
    burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));

    // Al elegir una opción del menú, se cierra
    $$('.navbar__link').forEach((link) => link.addEventListener('click', () => setMenu(false)));

    // Si agrandan la ventana a tamaño escritorio, cerramos el menú móvil
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) setMenu(false);
    });

    // --- 3.3 Resaltar el enlace de la sección visible ---
    // IntersectionObserver avisa cuando un elemento entra o sale de la pantalla
    const links = $$('.navbar__link');
    const sections = links.map((link) => $(link.getAttribute('href'))).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) =>
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id)
          );
        });
      },
      // La sección cuenta como "activa" cuando cruza la franja central de la pantalla
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* ===================================================================
     4. HERO: BRASAS
     -------------------------------------------------------------------
     Creamos varios <span class="ember"> con posición, tamaño y velocidad
     al azar. La animación en sí está en CSS (@keyframes emberRise);
     JS solo le pasa los valores mediante variables CSS (--x, --size...).
     =================================================================== */
  function initEmbers() {
    if (prefersReducedMotion) return;

    const container = $('#embers');
    const total = window.innerWidth < 600 ? 18 : 35; // Menos partículas en celular
    const random = (min, max) => Math.random() * (max - min) + min;

    // DocumentFragment: armamos todo "fuera" de la página y lo insertamos una sola vez (más rápido)
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
      const ember = document.createElement('span');
      ember.className = 'ember';
      ember.style.setProperty('--x', random(0, 100) + '%');
      ember.style.setProperty('--size', random(2, 5) + 'px');
      ember.style.setProperty('--duration', random(6, 14) + 's');
      ember.style.setProperty('--delay', random(0, 10) + 's');
      ember.style.setProperty('--drift', random(-60, 60) + 'px');
      fragment.appendChild(ember);
    }
    container.appendChild(fragment);
  }

  /* ===================================================================
     5. CATÁLOGO DE PERSONAJES
     -------------------------------------------------------------------
     Flujo:
       pestaña (Héroes/Enemigos) → renderList() dibuja las tarjetas
       tarjeta clicada           → renderDetail() dibuja la ficha
     =================================================================== */
  const rosterState = { faction: 'heroes', selectedId: null };

  // Devuelve el HTML del retrato: imagen si existe, si no las iniciales
  function portraitHTML(character, faction) {
    const initials = character.name
      .replace(/^(El|La|Los|Las)\s+/i, '') // "La Muerte" → "Muerte"
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const inner = character.image
      ? `<img src="${escapeHTML(character.image)}" alt="" loading="lazy">`
      : escapeHTML(initials);

    return `<span class="portrait" data-faction="${faction}" aria-hidden="true">${inner}</span>`;
  }

  // Dibuja la lista de tarjetas de la facción actual
  function renderList() {
    const list = $('#rosterList');
    const characters = CHARACTERS[rosterState.faction];

    // .map() convierte cada personaje en un string de HTML; .join('') los une
    list.innerHTML = characters
      .map(
        (c) => `
        <button class="char-card" type="button" data-id="${c.id}"
                aria-pressed="${c.id === rosterState.selectedId}">
          ${portraitHTML(c, rosterState.faction)}
          <span>
            <span class="char-card__name">${escapeHTML(c.name)}</span>
            <span class="char-card__role">${escapeHTML(c.role)}</span>
          </span>
        </button>`
      )
      .join('');
  }

  // Dibuja la ficha completa del personaje seleccionado
  function renderDetail() {
    const detail = $('#rosterDetail');
    const faction = rosterState.faction;
    const c = CHARACTERS[faction].find((item) => item.id === rosterState.selectedId);
    if (!c) return;

    // Object.entries convierte {Vida: 70} en [['Vida', 70]] para poder recorrerlo
    const statsHTML = Object.entries(c.stats)
      .map(
        ([label, value]) => `
        <div class="stat">
          <div class="stat__label"><span>${escapeHTML(label)}</span><span>${value}</span></div>
          <div class="stat__track"><div class="stat__fill" data-value="${value}"></div></div>
        </div>`
      )
      .join('');

    const abilitiesHTML = c.abilities.map((a) => `<li class="chip">${escapeHTML(a)}</li>`).join('');

    detail.innerHTML = `
      ${portraitHTML(c, faction)}
      <div>
        <span class="detail__tag detail__tag--${faction}">${faction === 'heroes' ? 'Héroe' : 'Enemigo'}</span>
        <h3 class="detail__name">${escapeHTML(c.name)}</h3>
        <p class="detail__role">${escapeHTML(c.role)}</p>
        <blockquote class="detail__quote">“${escapeHTML(c.quote)}”</blockquote>
        <p class="detail__desc">${escapeHTML(c.description)}</p>

        <h4 class="detail__subtitle">Estadísticas</h4>
        <div class="stats">${statsHTML}</div>

        <h4 class="detail__subtitle">${faction === 'heroes' ? 'Habilidades' : 'Ataques'}</h4>
        <ul class="chips">${abilitiesHTML}</ul>
      </div>`;

    // Reiniciamos la animación de entrada de la ficha
    detail.style.animation = 'none';
    void detail.offsetWidth; // Truco: forzar "reflow" para que la animación se repita
    detail.style.animation = '';

    // Esperamos un fotograma para que las barras arranquen en 0 y crezcan
    requestAnimationFrame(() => {
      $$('.stat__fill', detail).forEach((bar) => {
        bar.style.width = bar.dataset.value + '%';
      });
    });
  }

  // Selecciona un personaje: actualiza estado, tarjetas y ficha
  function selectCharacter(id) {
    rosterState.selectedId = id;
    $$('.char-card').forEach((card) => card.setAttribute('aria-pressed', String(card.dataset.id === id)));
    renderDetail();
  }

  // Cambia de facción (pestaña)
  function selectFaction(faction) {
    rosterState.faction = faction;
    rosterState.selectedId = CHARACTERS[faction][0].id; // Muestra el primero por defecto

    $$('.tab').forEach((tab) => {
      const active = tab.dataset.faction === faction;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1; // Solo la pestaña activa recibe foco con Tab
      if (active) $('#roster').setAttribute('aria-labelledby', tab.id);
    });

    renderList();
    renderDetail();
  }

  function initRoster() {
    // Clic en pestañas
    const tabs = $$('.tab');
    tabs.forEach((tab) => tab.addEventListener('click', () => selectFaction(tab.dataset.faction)));

    // Flechas izquierda/derecha para moverse entre pestañas (patrón accesible de tabs)
    $('.tabs').addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const index = tabs.findIndex((t) => t.classList.contains('is-active'));
      const step = e.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(index + step + tabs.length) % tabs.length];
      selectFaction(next.dataset.faction);
      next.focus();
    });

    // DELEGACIÓN DE EVENTOS: un solo listener en el contenedor atiende
    // los clics de todas las tarjetas, incluso las que se crean después.
    $('#rosterList').addEventListener('click', (e) => {
      const card = e.target.closest('.char-card');
      if (card) selectCharacter(card.dataset.id);
    });

    selectFaction('heroes'); // Estado inicial
  }

  /* ===================================================================
     6. ANIMACIONES DE APARICIÓN AL HACER SCROLL
     =================================================================== */
  function initReveal() {
    const elements = $$('.reveal');

    // Navegadores muy viejos sin IntersectionObserver: mostramos todo
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target); // Solo se anima una vez
          }
        });
      },
      { threshold: 0.15 } // Se activa cuando el 15 % del elemento es visible
    );
    elements.forEach((el) => observer.observe(el));
  }

  /* ===================================================================
     7. MODAL DE AUTENTICACIÓN
     =================================================================== */
  const modal = { el: null, lastFocused: null };

  function openModal(tab = 'login') {
    modal.lastFocused = document.activeElement; // Para devolver el foco al cerrar
    modal.el.classList.add('is-open');
    modal.el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    switchAuthTab(tab);
    // Ponemos el cursor en el primer campo (pequeño retraso por la animación)
    setTimeout(() => $('.auth-form:not([hidden]) .field__input', modal.el)?.focus(), 150);
  }

  function closeModal() {
    modal.el.classList.remove('is-open');
    modal.el.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    modal.lastFocused?.focus(); // ?. = solo si existe
  }

  // Cambia entre el formulario de login y el de registro
  function switchAuthTab(name) {
    $$('.auth-tab', modal.el).forEach((tab) => {
      const active = tab.dataset.authTab === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    $$('.auth-form', modal.el).forEach((form) => {
      form.hidden = form.dataset.authPanel !== name;
    });
  }

  // "Trampa de foco": con Tab el foco da vueltas DENTRO del modal (accesibilidad)
  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusables = $$('button, input, a[href]', $('.modal__box', modal.el)).filter(
      (el) => !el.closest('[hidden]') && !el.disabled
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function initModal() {
    modal.el = $('#authModal');

    $('#openAuth').addEventListener('click', () => {
      if (!currentUser) openModal('login'); // con sesión iniciada, el botón sirve para salir
    });

    // Cualquier elemento con data-close-modal (fondo y botón ✕) cierra el modal
    $$('[data-close-modal]', modal.el).forEach((el) => el.addEventListener('click', closeModal));

    // Tecla Escape cierra; Tab queda atrapado dentro
    document.addEventListener('keydown', (e) => {
      if (!modal.el.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeModal();
      trapFocus(e);
    });

    $$('.auth-tab', modal.el).forEach((tab) =>
      tab.addEventListener('click', () => switchAuthTab(tab.dataset.authTab))
    );

    // Botones de ojo para mostrar/ocultar la contraseña
    $$('[data-toggle-password]', modal.el).forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = $('#' + btn.dataset.togglePassword);
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
        btn.textContent = show ? '🙈' : '👁';
      });
    });
  }

  /* ===================================================================
     8. VALIDACIÓN DE FORMULARIOS
     -------------------------------------------------------------------
     Cada input declara sus reglas en el HTML: data-rules="required|email"
     Aquí tenemos un "diccionario" de reglas: cada una recibe el campo y
     devuelve un mensaje de error (string) o null si está bien.
     Ventaja: para agregar una regla nueva solo se añade una función aquí.

     ⚠ IMPORTANTE: la validación en el frontend es solo para COMODIDAD del
     usuario. Cualquiera puede saltársela, así que el BACKEND debe volver a
     validar todo cuando lo implementen.
     =================================================================== */

  // Expresión regular simple para correos: texto@texto.dominio
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // Nombre de jugador: 3 a 16 caracteres, letras, números, guion bajo, ñ
  const USERNAME_REGEX = /^[a-zA-Z0-9_ñÑ]{3,16}$/;

  const RULES = {
    required: (input) => {
      if (input.type === 'checkbox') return null; // los checkbox usan "checked"
      return input.value.trim() === '' ? 'Este campo es obligatorio.' : null;
    },
    email: (input) =>
      input.value && !EMAIL_REGEX.test(input.value.trim()) ? 'Escribe un correo válido (ej. jugador@correo.com).' : null,
    username: (input) =>
      input.value && !USERNAME_REGEX.test(input.value.trim())
        ? 'De 3 a 16 caracteres: letras, números o guion bajo.'
        : null,
    password: (input) => {
      const v = input.value;
      if (!v) return null;
      if (v.length < 8) return 'Debe tener al menos 8 caracteres.';
      if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Combina letras y números.';
      return null;
    },
    // match:regPassword → debe ser igual al campo con ese id
    match: (input, targetId) => {
      const target = $('#' + targetId);
      return input.value && target && input.value !== target.value ? 'Las contraseñas no coinciden.' : null;
    },
    checked: (input) => (input.checked ? null : 'Debes aceptar para continuar.')
  };

  // Valida un solo campo: aplica sus reglas en orden y se detiene en el primer error
  function validateField(input) {
    const rules = (input.dataset.rules || '').split('|').filter(Boolean);
    let error = null;

    for (const rule of rules) {
      const [name, param] = rule.split(':'); // "match:regPassword" → ["match", "regPassword"]
      const check = RULES[name];
      if (check) error = check(input, param);
      if (error) break;
    }

    // Pintamos el resultado
    const errorBox = $('#' + input.id + '-error');
    if (errorBox) errorBox.textContent = error || '';
    input.setAttribute('aria-invalid', String(Boolean(error)));
    if (input.type !== 'checkbox') {
      input.classList.toggle('is-invalid', Boolean(error));
      input.classList.toggle('is-valid', !error && input.value.trim() !== '');
    }
    return !error;
  }

  // Valida todo un formulario; devuelve true si todos los campos son válidos
  function validateForm(form) {
    const fields = $$('[data-rules]', form);
    const results = fields.map(validateField); // Validamos TODOS para mostrar todos los errores
    const firstInvalid = fields.find((_, i) => !results[i]);
    firstInvalid?.focus();
    return !firstInvalid;
  }

  // Calcula la fuerza de la contraseña (0 a 4 puntos) y pinta la barra
  function updateStrength(value) {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const colors = ['transparent', '#ff5c64', '#e0a43a', '#c9d43a', '#2bd977'];
    const bar = $('#strengthBar');
    bar.style.width = (score / 4) * 100 + '%';
    bar.style.backgroundColor = colors[score];
  }

  // Simula la petición al servidor (se reemplazará por fetch() al backend)
  function fakeRequest(ms = 900) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function initForms() {
    const loginForm = $('#loginForm');
    const registerForm = $('#registerForm');

    // Validación "en vivo": al salir de un campo (blur) y, si ya tenía error, al escribir
    $$('[data-rules]').forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) validateField(input);
      });
      input.addEventListener('change', () => {
        if (input.type === 'checkbox') validateField(input);
      });
    });

    // Barra de fuerza y re-validar la confirmación cuando cambia la contraseña
    $('#regPassword').addEventListener('input', (e) => {
      updateStrength(e.target.value);
      const confirm = $('#regConfirm');
      if (confirm.value) validateField(confirm);
    });

    // --- Envío del LOGIN ---
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Evita que la página se recargue
      if (!validateForm(loginForm)) return;
      if (!db || !navigator.onLine) { showToast(NO_CONNECTION_MSG, 5000); return; }

      const button = $('button[type="submit"]', loginForm);
      button.classList.add('is-loading');
      button.textContent = 'Entrando...';

      // FormData lee todos los campos del formulario por su atributo name
      const data = Object.fromEntries(new FormData(loginForm));

      const { error } = await db.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });

      button.classList.remove('is-loading');
      button.textContent = 'Entrar';

      if (error) {
        showToast(authErrorMessage(error));
        return;
      }

      loginForm.reset();
      $$('.field__input', loginForm).forEach((i) => i.classList.remove('is-valid'));
      closeModal();
      // El saludo y el botón "Salir" los actualiza onAuthStateChange
      showToast('¡Bienvenido de vuelta!');
    });

    // --- Envío del REGISTRO ---
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(registerForm)) return;
      if (!db || !navigator.onLine) { showToast(NO_CONNECTION_MSG, 5000); return; }

      const button = $('button[type="submit"]', registerForm);
      button.classList.add('is-loading');
      button.textContent = 'Creando cuenta...';

      const data = Object.fromEntries(new FormData(registerForm));
      const username = data.username.trim();

      // Revisar que el nombre de jugador no exista (profiles es de lectura pública)
      const { data: taken } = await db
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (taken) {
        button.classList.remove('is-loading');
        button.textContent = 'Crear cuenta';
        showToast('Ese nombre de jugador ya existe. Elige otro.');
        return;
      }

      // El username viaja en "data": el trigger lo copia a la tabla profiles
      const { data: result, error } = await db.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: { data: { username } },
      });

      button.classList.remove('is-loading');
      button.textContent = 'Crear cuenta';

      if (error) {
        showToast(authErrorMessage(error));
        return;
      }

      registerForm.reset();
      updateStrength('');
      $$('.field__input', registerForm).forEach((i) => i.classList.remove('is-valid'));
      closeModal();

      if (result.session) {
        showToast(`¡Cuenta creada, ${username}!`);
      } else {
        // Pasa cuando "Confirm email" está activado en Supabase
        showToast('Cuenta creada. Revisa tu correo para confirmarla.', 6000);
      }
    });
  }

  /* ===================================================================
     8b. SESIÓN — botón "Iniciar sesión" / "Salir"
     -------------------------------------------------------------------
     Supabase guarda la sesión en el navegador. Cada vez que cambia
     (login, logout, recargar la página) se ejecuta onAuthStateChange.
     =================================================================== */
  let currentUser = null;

  function renderSessionButton() {
    const btn = $('#openAuth');
    if (currentUser) {
      const name = currentUser.user_metadata?.username || currentUser.email.split('@')[0];
      btn.innerHTML = '<span class="label-long"></span><span class="label-short">Salir</span>';
      $('.label-long', btn).textContent = `Salir (${name})`;
    } else {
      btn.innerHTML = '<span class="label-long">Iniciar sesión</span><span class="label-short">Entrar</span>';
    }
  }

  function initSession() {
    if (!db) return; // sin librería (offline): el botón solo abre el login
    // Con sesión iniciada, el mismo botón cierra la sesión
    $('#openAuth').addEventListener('click', async () => {
      if (!currentUser) return;
      await db.auth.signOut();
      showToast('Sesión cerrada.');
    });

    db.auth.onAuthStateChange((_event, session) => {
      currentUser = session ? session.user : null;
      renderSessionButton();
    });
  }

  /* ===================================================================
     9. ENLACES PLACEHOLDER + AÑO
     -------------------------------------------------------------------
     Los botones de descarga todavía no tienen link real (href="#").
     Les pusimos data-placeholder-link para avisar al usuario en vez de
     no hacer nada. Cuando pongan el link real, borren ese atributo y
     este código deja de afectarlos automáticamente.
     =================================================================== */
  function initPlaceholders() {
    $$('[data-placeholder-link]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Disponible muy pronto. ¡Síguenos en redes para enterarte!');
      });
    });

    $('#year').textContent = new Date().getFullYear();
  }

  /* ===================================================================
     10. INIT — punto de arranque
     =================================================================== */
  /* ===================================================================
     10. PWA — service worker, botón "Instalar" y aviso sin conexión
     -------------------------------------------------------------------
     PWA = página web que se puede instalar como app y abrir sin internet.
     El archivo sw.js guarda en caché el sitio; aquí solo lo registramos.
     =================================================================== */
  function initPWA() {
    // 1) Registrar el service worker (necesita HTTPS o localhost)
    if ('serviceWorker' in navigator) {
      const register = () =>
        navigator.serviceWorker.register('sw.js').catch((err) => console.warn('Service worker no registrado:', err));
      if (document.readyState === 'complete') register();
      else window.addEventListener('load', register);
    }

    // 2) Botón "Instalar como app": el navegador avisa cuando se puede instalar
    const installBtn = $('#installBtn');
    let installEvent = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      installEvent = e;
      if (installBtn) installBtn.hidden = false;
    });
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (!installEvent) return;
        installEvent.prompt();
        await installEvent.userChoice;
        installEvent = null;
        installBtn.hidden = true;
      });
    }
    window.addEventListener('appinstalled', () => {
      if (installBtn) installBtn.hidden = true;
      showToast('¡HELLMED instalada!');
    });

    // 3) Aviso cuando no hay internet
    const banner = $('#offlineBanner');
    const updateStatus = () => { if (banner) banner.hidden = navigator.onLine; };
    window.addEventListener('online', () => { updateStatus(); showToast('Conexión restablecida.'); });
    window.addEventListener('offline', updateStatus);
    updateStatus();
  }

  function init() {
    initTheme();
    initNavbar();
    initEmbers();
    initRoster();
    initReveal();
    initModal();
    initForms();
    initSession();
    initPWA();
    initPlaceholders();
  }

  init(); // Gracias a "defer" en el <script>, el HTML ya existe aquí
})();
