// Example: 1260500 => "1,260,500"
export function formatWithCommas(number: number): string {
  if (!number) 'undefined';

  return number.toLocaleString();
}

// Example: 1500 => "1.5 K", 1000 => "1 K", 1010 => "1.01 K", 1260500 => "1.26 M"
export function formatCompact(number: number): string {
  if (!number) return 'undefined';

  if (number >= 1_000_000) {
    return parseFloat((number / 1_000_000).toFixed(2)) + ' M';
  }
  if (number >= 1_000) {
    return parseFloat((number / 1_000).toFixed(2)) + ' K';
  }
  return parseFloat(number.toFixed(2)).toString();
}
