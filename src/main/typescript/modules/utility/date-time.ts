//
// Date Time Helper
//


function get0amDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toLocaleDateString(date: Date, locale?: string): string {
  return date.toLocaleDateString(locale, { dateStyle: 'medium' });
}

export function toLocaleDateTimeString(date: Date, locale?: string): string {
  return date.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'medium' });
}

type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

function getRelativeString(value: number, unit: TimeUnit, locale?: string, numeric?: 'always' | 'auto'): string {
  value = Math.round(value);

  if(Intl && Intl.RelativeTimeFormat) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: numeric });
    return rtf.format(value, unit);
  }
  else {
    const ago = (value < 0 || Object.is(value, -0));
    if(ago)
      value = -value;
    const s = (value === 1) ? '' : 's';
    const str = `${value} ${unit}${s}`;
    return ago ? (str + ' ago') : ('in ' + str);
  }
}

function toRelativeString(startUnit: TimeUnit, baseDate: Date | null | undefined, targetDate: Date, locale?: string, numeric?: 'always' | 'auto'): string {
  if(baseDate) {
    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const year = 146097 * (day / 400); // 1 year = (((((365*4+1)/4)*100-1)/100)*400+1)/400 days
    const month = year / 12;

    const base = baseDate.getTime();
    const target = targetDate.getTime();
    const diff = -(base - target); // -0 if base === target
    const elapsed = (diff > 0) ? diff : -diff;

    const unitMap = [
      { unit: 'second', time: second },
      { unit: 'minute', time: minute },
      { unit: 'hour',   time: hour },
      { unit: 'day',    time: day },
      { unit: 'month',  time: month },
      { unit: 'year',   time: year },
    ] as const;

    const foundIndex = unitMap.findIndex(x => x.unit === startUnit);
    const startUnitIndex = (foundIndex >= 0) ? foundIndex : unitMap.length;

    for(let i = startUnitIndex; i < unitMap.length; ++i) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const current = unitMap[i]!;
      const next = unitMap[i + 1];
      if(!next || elapsed < next.time - current.time / 2) {
        return getRelativeString(diff / current.time, current.unit, locale, numeric);
      }
      // Clear `numeric` if unit is not `startUnit`
      numeric = undefined;
    }
  }

  return 'on ' + toLocaleDateString(targetDate, locale);
}

export function toRelativeDateString(baseDate: Date | null | undefined, targetDate: Date, locale?: string): string {
  const base0amDate = baseDate ? get0amDate(baseDate) : null;
  const target0amDate = get0amDate(targetDate);
  return toRelativeString('day', base0amDate, target0amDate, locale, 'auto');
}

export function toRelativeTimeString(baseDate: Date | null | undefined, targetDate: Date, locale?: string): string {
  return toRelativeString('second', baseDate, targetDate, locale);
}
