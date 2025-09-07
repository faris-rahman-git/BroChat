export function getUrlParams(
  url = window.location.href
) {
  const urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}