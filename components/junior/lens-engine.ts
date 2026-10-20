/** Ideal thin-lens approximation with standard Cartesian sign convention (real object distance positive).
 * Positive focal length: converging, negative: diverging; image distance positive = real. */
export function lensImage(focalLength: number, objectDistance: number, objectHeight: number) {
  if (![focalLength, objectDistance, objectHeight].every(Number.isFinite) || focalLength === 0 || objectDistance <= 0 || objectHeight <= 0) throw Error('Invalid ideal lens');
  const inverse = 1 / focalLength - 1 / objectDistance;
  const di = Math.abs(inverse) < 1e-10 ? Infinity : 1 / inverse;
  const magnification = Number.isFinite(di) ? -di / objectDistance : Infinity;
  return { imageDistance: di, magnification, imageHeight: magnification * objectHeight, real: di > 0 };
}
