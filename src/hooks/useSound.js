export function playSound(src) {
  const sound = new Audio(src);
  sound.play().catch((err) => {
    // silent fail (e.g., autoplay restriction)
  });
}
