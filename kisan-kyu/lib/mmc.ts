// lib/mmc.ts

/**
 * Calculates the expected wait time in queue (Wq) using M/M/c queueing theory.
 * 
 * @param lambda Arrival rate (farmers arriving per minute)
 * @param mu Service rate per counter (farmers processed per minute per counter)
 * @param c Number of active counters (lanes)
 * @param currentQueueLength Current number of people waiting
 * @returns Expected wait time in minutes
 */
export function calculateWaitTime(
  lambda: number,
  mu: number,
  c: number,
  currentQueueLength: number
): number {
  // Utilization factor (rho)
  const rho = lambda / (c * mu);
  
  // If utilization is >= 1, the system is overloaded (infinite wait theoretically).
  // For demo purposes, we cap it or fall back to a simple multiplier.
  if (rho >= 1) {
    return Math.round((currentQueueLength + 1) / (c * mu)); // Simple Little's law approximation for overloaded queue
  }

  // Calculate P0 (probability of 0 customers in system)
  let sum = 0;
  for (let n = 0; n < c; n++) {
    sum += Math.pow(lambda / mu, n) / factorial(n);
  }
  
  const cFactorial = factorial(c);
  const term2 = (Math.pow(lambda / mu, c) / cFactorial) * (1 / (1 - rho));
  const P0 = 1 / (sum + term2);

  // Calculate Lq (Expected length of queue)
  const Lq = (P0 * Math.pow(lambda / mu, c) * rho) / (cFactorial * Math.pow(1 - rho, 2));

  // Calculate Wq (Expected wait time in queue)
  let Wq = Lq / lambda; // in minutes

  // ML Correction Layer (Rule-based adjustment as requested for the demo)
  // If the queue is long or it's afternoon (simulated here), we add an adjustment factor.
  const isAfternoon = new Date().getHours() >= 12;
  
  if (currentQueueLength > 10) {
    Wq *= 1.2; // +20% if queue > 10
  } else if (isAfternoon) {
    Wq *= 1.15; // +15% if afternoon
  }

  // Ensure wait time makes sense relative to the physical queue length 
  // (a purely theoretical empty M/M/c system might predict 0, but if there are 5 people waiting, there is physical wait)
  const minimumPhysicalWait = currentQueueLength / (c * mu);
  
  return Math.round(Math.max(Wq, minimumPhysicalWait));
}

// Helper function
function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
