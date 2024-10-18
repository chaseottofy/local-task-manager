export default function placeModal(parent) {
  const windowHeight = window.innerHeight;
  const mid = Math.floor(windowHeight / 2);
  const diff = Math.floor(windowHeight - parent.getBoundingClientRect().bottom);
  return diff > mid ? 'down' : 'up';
}
