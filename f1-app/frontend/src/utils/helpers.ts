export function formatTime(seconds: number): string {
  if (seconds < 1) {
    return `+${(seconds * 1000).toFixed(0)}ms`;
  }
  return `+${seconds.toFixed(3)}s`;
}

export function formatGap(gap: number | null): string {
  if (gap === null) return 'Leader';
  if (gap < 1) return `+${(gap * 1000).toFixed(0)}ms`;
  return `+${gap.toFixed(3)}s`;
}

export function getPositionClass(position: number): string {
  if (position === 1) return 'position-1';
  if (position === 2) return 'position-2';
  if (position === 3) return 'position-3';
  return 'bg-gray-700 text-gray-300';
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
