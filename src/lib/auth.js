export function saveToken(token) {
  localStorage.setItem('unfold_token', token);
}
export function getToken() {
  return localStorage.getItem('unfold_token');
}
export function logout() {
  localStorage.removeItem('unfold_token');
}
