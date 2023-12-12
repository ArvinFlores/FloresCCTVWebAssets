const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export function daysBetween (d1: Date, d2: Date): number {
  const date1 = new Date(d1.setHours(0, 0, 0, 0));
  const date2 = new Date(d2.setHours(0, 0, 0, 0));
  const date1Time = date1.getTime();
  const date2Time = date2.getTime();
  const timeDiff = date2Time - date1Time;

  return Math.abs(timeDiff / (1000 * 3600 * 24));
}

export function ampmFormat (date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const realHr = h % 12;
  const hours = realHr || 12;
  const minutes = m < 10 ? `0${m}` : m;
  const ampm = h >= 12 ? 'pm' : 'am';

  return `${hours}:${minutes} ${ampm}`;
}

export function daysAgoFormat (date: Date, capitalize?: boolean): string {
  const today = new Date();
  const dayDiff = daysBetween(today, date);

  if (dayDiff === 0) {
    return capitalize ? 'Today' : 'today';
  }

  if (dayDiff === 1) {
    return capitalize ? 'Yesterday' : 'yesterday';
  }

  return `${dayDiff} days ago`;
}

export function dateFormat (date: Date, format: string): string {
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  return format.replace(/(mm)/, months[month])
    .replace(/(MM)/, String(month + 1))
    .replace(/(DD)|(dd)/, String(day))
    .replace(/(YYYY)|(yyyy)/, String(year))
    .replace('ampm', ampmFormat(date));
}
