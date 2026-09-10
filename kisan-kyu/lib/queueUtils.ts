export interface QueueItem {
  id: string;
  tokenNumber: string;
  farmerName: string;
  phoneNumber?: string;
  farmerId?: string;
  cropType: string;
  lotSize: string;
  lotSizeNum: number;
  arrivalTime: string;
  status: "Processing" | "Waiting" | "Completed" | "Cancelled";
  estimatedWait: string;
}

/**
 * Isolated helper function to calculate estimated waiting time.
 * This can easily be replaced by an ML prediction model later.
 */
export function calculateWaitTimeMinutes(
  waitingCountAhead: number,
  activeCounters: number = 3,
  avgMinutesPerLot: number = 15
): number {
  if (waitingCountAhead <= 0) return 0;
  const totalMinutes = (waitingCountAhead * avgMinutesPerLot) / activeCounters;
  return Math.round(totalMinutes);
}

/**
 * Formats minutes into human-readable time string (e.g. 90 -> "1h 30m", 15 -> "15m", 0 -> "Immediate")
 */
export function formatWaitTime(minutes: number): string {
  if (minutes <= 0) return "Immediate";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Helper to calculate wait time string for a given number of waiting farmers ahead.
 */
export function getEstimatedWaitText(
  waitingCountAhead: number,
  activeCounters: number = 3
): string {
  const mins = calculateWaitTimeMinutes(waitingCountAhead, activeCounters);
  return formatWaitTime(mins);
}

/**
 * Generates the next sequential token number from existing queue items.
 */
export function generateNextToken(items: QueueItem[]): string {
  let maxTokenNum = 108; // default starting base token integer

  items.forEach((item) => {
    const match = item.tokenNumber.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num > maxTokenNum) {
        maxTokenNum = num;
      }
    }
  });

  const nextNum = maxTokenNum + 1;
  return `TK-${nextNum}`;
}
