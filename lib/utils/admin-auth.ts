export const ADMIN_AUTH_COOKIE_NAME = 'skyhub_admin_token';
export const ADMIN_EXPIRATION_KEY = 'skyhub_admin_expires_at';
export const SESSION_DURATION_HOURS = 24; // Session expires in 24 hours

export function setAdminAuthSession() {
  const expiresAt = Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000;
  const maxAgeSeconds = SESSION_DURATION_HOURS * 60 * 60;

  // Set HTTP Cookie readable by Next.js middleware
  document.cookie = `${ADMIN_AUTH_COOKIE_NAME}=skyhub_authenticated_session; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
  document.cookie = `${ADMIN_EXPIRATION_KEY}=${expiresAt}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;

  // Set localStorage and sessionStorage
  localStorage.setItem(ADMIN_AUTH_COOKIE_NAME, 'true');
  localStorage.setItem(ADMIN_EXPIRATION_KEY, expiresAt.toString());
  sessionStorage.setItem('skyhub_admin_auth', 'true');
}

export function clearAdminAuthSession() {
  // Clear Cookies
  document.cookie = `${ADMIN_AUTH_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${ADMIN_EXPIRATION_KEY}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  // Clear LocalStorage / SessionStorage
  localStorage.removeItem(ADMIN_AUTH_COOKIE_NAME);
  localStorage.removeItem(ADMIN_EXPIRATION_KEY);
  sessionStorage.removeItem('skyhub_admin_auth');
}

export function getAdminExpiryTimestamp(): number | null {
  if (typeof window === 'undefined') return null;

  // Check Cookie first
  const match = document.cookie.match(new RegExp('(^| )' + ADMIN_EXPIRATION_KEY + '=([^;]+)'));
  if (match && match[2]) {
    const val = Number(match[2]);
    if (!isNaN(val)) return val;
  }

  // Fallback to localStorage
  const localVal = localStorage.getItem(ADMIN_EXPIRATION_KEY);
  if (localVal) {
    const val = Number(localVal);
    if (!isNaN(val)) return val;
  }

  return null;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  const expiry = getAdminExpiryTimestamp();
  if (!expiry) return false;

  // Check if session has expired
  if (Date.now() > expiry) {
    clearAdminAuthSession();
    return false;
  }

  return true;
}
