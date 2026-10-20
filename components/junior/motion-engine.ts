/** Closed-form point-mass projectile, level launch/landing, no air resistance. SI units. */
export interface Launch { speed: number; angle: number; gravity: number; }
export interface FlightPoint { t: number; x: number; y: number; vx: number; vy: number; speed: number; kineticPerKg: number; potentialPerKg: number; }
export function flightDuration(p: Launch): number {
  if (!(p.speed >= 0) || !(p.gravity > 0) || ![p.speed, p.angle, p.gravity].every(Number.isFinite) || p.angle < 0 || p.angle > 90) throw Error('Invalid launch parameters');
  return 2 * p.speed * Math.sin(p.angle * Math.PI / 180) / p.gravity;
}
export function flightPoint(p: Launch, t: number): FlightPoint {
  const T = flightDuration(p), elapsed = Math.max(0, Math.min(T, t));
  const vx = p.speed * Math.cos(p.angle * Math.PI / 180), v0y = p.speed * Math.sin(p.angle * Math.PI / 180);
  const vy = v0y - p.gravity * elapsed, y = Math.max(0, v0y * elapsed - .5 * p.gravity * elapsed * elapsed);
  const speed = Math.hypot(vx, vy);
  return { t: elapsed, x: vx * elapsed, y, vx, vy, speed, kineticPerKg: .5 * speed * speed, potentialPerKg: p.gravity * y };
}
export function flightStats(p: Launch) {
  const duration = flightDuration(p), vx = p.speed * Math.cos(p.angle * Math.PI / 180), peak = p.speed ** 2 * Math.sin(p.angle * Math.PI / 180) ** 2 / (2 * p.gravity);
  return { duration, range: vx * duration, peak, peakTime: duration / 2 };
}
