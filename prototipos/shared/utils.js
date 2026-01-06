/**
 * UTILS.JS - Bambu CRM V2 Prototipo
 * Funciones helper compartidas
 */

// ============================================================================
// FORMATEO
// ============================================================================

/**
 * Formatea número a moneda argentina
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea fecha a formato argentino (DD/MM/YYYY)
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formatea CUIT con guiones
 */
function formatCUIT(cuit) {
  if (!cuit) return '';
  const cleaned = cuit.replace(/\D/g, '');
  if (cleaned.length !== 11) return cuit;
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 10)}-${cleaned.slice(10)}`;
}

/**
 * Formatea teléfono argentino
 */
function formatPhone(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  return phone;
}

// ============================================================================
// VALIDACIÓN
// ============================================================================

/**
 * Valida email
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Valida CUIT argentino
 */
function isValidCUIT(cuit) {
  const cleaned = cuit.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  // Validación básica de longitud, podría mejorarse con algoritmo de dígito verificador
  return true;
}

// ============================================================================
// MANIPULACIÓN DOM
// ============================================================================

/**
 * Muestra/oculta elemento
 */
function toggleElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
  }
}

/**
 * Muestra elemento
 */
function showElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'block';
  }
}

/**
 * Oculta elemento
 */
function hideElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
}

// ============================================================================
// NOTIFICACIONES
// ============================================================================

/**
 * Muestra notificación temporal
 */
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    border-radius: 0.375rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

// ============================================================================
// STORAGE LOCAL
// ============================================================================

/**
 * Guarda datos en localStorage (útil para persistencia temporal entre páginas)
 */
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error guardando en localStorage:', e);
    return false;
  }
}

/**
 * Lee datos de localStorage
 */
function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error leyendo de localStorage:', e);
    return null;
  }
}

/**
 * Elimina datos de localStorage
 */
function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error eliminando de localStorage:', e);
    return false;
  }
}

// ============================================================================
// CÁLCULOS
// ============================================================================

/**
 * Calcula descuento sobre monto
 */
function calculateDiscount(amount, percentageDiscount) {
  return amount * (percentageDiscount / 100);
}

/**
 * Calcula subtotal con descuento
 */
function calculateSubtotalWithDiscount(amount, percentageDiscount) {
  return amount - calculateDiscount(amount, percentageDiscount);
}

/**
 * Redondea a 2 decimales
 */
function roundTo2Decimals(num) {
  return Math.round(num * 100) / 100;
}

// ============================================================================
// TEMA (DARK MODE)
// ============================================================================

/**
 * Obtiene el tema actual
 */
function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

/**
 * Establece el tema
 */
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  saveToStorage('bambu-theme', theme);

  // Actualizar icono si existe
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

/**
 * Alterna entre light y dark mode
 */
function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

/**
 * Inicializa el tema (llamar en DOMContentLoaded)
 * Prioridad: 1) localStorage, 2) preferencia del sistema, 3) light
 */
function initTheme() {
  const savedTheme = getFromStorage('bambu-theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }
}

// Auto-inicializar tema al cargar
document.addEventListener('DOMContentLoaded', initTheme);

// ============================================================================
// SIDEBAR (Persistente entre páginas)
// ============================================================================

/**
 * Inicializa el sidebar con estado persistente.
 *
 * LÓGICA:
 * - Default: expandido
 * - Solo se colapsa/expande con el botón
 * - Estado se guarda en localStorage y persiste entre páginas
 * - Sin setTimeout, sin hover auto-collapse
 */
function initSidebar() {
    const sidebar = document.getElementById('main-sidebar');
    const btnToggle = document.getElementById('btn-toggle-sidebar');

    if (!sidebar || !btnToggle) return;

    // Leer estado guardado (default: expandido = false significa NO collapsed)
    const isCollapsed = getFromStorage('bambu-sidebar-collapsed') === true;

    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        updateToggleIcon(btnToggle, true);
    }

    // Click en botón toggle
    btnToggle.addEventListener('click', () => {
        const nowCollapsed = sidebar.classList.toggle('collapsed');
        saveToStorage('bambu-sidebar-collapsed', nowCollapsed);
        updateToggleIcon(btnToggle, nowCollapsed);
    });
}

/**
 * Actualiza el icono del botón toggle
 */
function updateToggleIcon(btn, isCollapsed) {
    const icon = btn.querySelector('i');
    if (icon) {
        icon.className = isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
    }
}

// Auto-inicializar sidebar al cargar
document.addEventListener('DOMContentLoaded', initSidebar);
