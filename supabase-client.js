/* =====================================================================
   HELLMED — supabase-client.js
   Configuración ÚNICA de Supabase para todas las páginas de la web
   (index.html y reset.html). La app móvil usa EXACTAMENTE la misma
   URL y la misma publishable key (ver movil/SupabaseCliente.kt): por eso una
   cuenta creada en un lado sirve en el otro.

   Sesión persistente:
   - Supabase guarda un access token (dura ~1 h) y un refresh token.
   - autoRefreshToken renueva el access token solo, antes de que caduque.
   - persistSession lo guarda en el navegador → al volver a abrir la web
     sigues dentro sin escribir correo ni contraseña.
   - "Recordarme": si está marcado se guarda en localStorage (permanente);
     si no, en sessionStorage (se borra al cerrar el navegador).
   ===================================================================== */
(function () {
  'use strict';

  const CONFIG = {
    SUPABASE_URL: 'https://wqvbtmypnvnqcncqvidt.supabase.co',
    // Proyecto "Helmell". La publishable key es pública por diseño; la seguridad la dan las políticas RLS.
    // ⚠ NUNCA pongas aquí la "secret key" (sb_secret_...).
    SUPABASE_KEY: 'sb_publishable__yWj_inp5JvfRD0JmFYAGQ_PR-_NkSg',
    // Debe coincidir con la versión de legal/aviso-privacidad.html y con Legal.kt de la app
    PRIVACY_VERSION: '2026-11-11',
    STORAGE_KEY: 'hellmed-auth',
    REMEMBER_KEY: 'hellmed-remember',
    // URL base del sitio publicado (para los enlaces de los correos). Se calcula sola:
    // https://usuario.github.io/HELLMED-Pulse-of-the-damned/
    SITE_URL: new URL('./', window.location.href).href
  };

  // try/catch: en modo privado algunos navegadores bloquean el almacenamiento
  const safe = (fn, fallback = null) => { try { return fn(); } catch (e) { return fallback; } };

  function remember() {
    return safe(() => localStorage.getItem(CONFIG.REMEMBER_KEY), null) !== '0';
  }

  // Adaptador de almacenamiento que respeta "Recordarme"
  const authStorage = {
    getItem: (key) =>
      safe(() => localStorage.getItem(key)) ?? safe(() => sessionStorage.getItem(key)),
    setItem: (key, value) => {
      const keep = remember();
      safe(() => (keep ? localStorage : sessionStorage).setItem(key, value));
      safe(() => (keep ? sessionStorage : localStorage).removeItem(key)); // evita copias viejas
    },
    removeItem: (key) => {
      safe(() => localStorage.removeItem(key));
      safe(() => sessionStorage.removeItem(key));
    }
  };

  function setRemember(value) {
    safe(() => localStorage.setItem(CONFIG.REMEMBER_KEY, value ? '1' : '0'));
  }

  const client = window.supabase
    ? window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true, // procesa los enlaces de confirmación y de recuperación
          flowType: 'implicit',     // los enlaces pedidos desde la app móvil también se abren aquí
          storageKey: CONFIG.STORAGE_KEY,
          storage: authStorage
        }
      })
    : null; // sin internet la librería no carga: el sitio sigue funcionando sin login

  window.HELLMED = { CONFIG, db: client, setRemember };
})();
