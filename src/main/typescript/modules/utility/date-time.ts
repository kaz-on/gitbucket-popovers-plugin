//
// Date Time Helper
//


function convertDateTo0am(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toLocaleDateString(date: Date, locales?: string | string[]): string {
  return date.toLocaleDateString(locales, { dateStyle: 'medium' });
}

export function toLocaleDateTimeString(date: Date, locales?: string | string[]): string {
  return date.toLocaleString(locales, { dateStyle: 'medium', timeStyle: 'medium' });
}

type TimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';

function getRelativeTimeString(value: number, unit: TimeUnit, locales?: string | string[], numericAuto?: boolean): string {
  value = Math.round(value);

  if(Intl && Intl.RelativeTimeFormat) {
    const numeric = numericAuto ? 'auto' : 'always';
    const rtf = new Intl.RelativeTimeFormat(locales, { numeric: numeric });
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

function getTimeUnit(diffTime: number, minimumUnit?: TimeUnit) {
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;
  const year = 146097 * (day / 400); // 1 year = (((((365*4+1)/4)*100-1)/100)*400+1)/400 days
  const month = year / 12;

  const _unitMap = [
    { name: 'second', time: second },
    { name: 'minute', time: minute },
    { name: 'hour',   time: hour },
    { name: 'day',    time: day },
    { name: 'month',  time: month },
    { name: 'year',   time: year },
  ] as const;

  // Check unit names
  type UnitNames = typeof _unitMap[number]['name'];
  type Units = [UnitNames, TimeUnit] extends [TimeUnit, UnitNames] ? typeof _unitMap : never;
  const unitMap: Units = _unitMap;

  const foundIndex = unitMap.findIndex(unit => unit.name === minimumUnit);
  const minUnitIndex = (foundIndex >= 0) ? foundIndex : 0;
  const maxUnitIndex = unitMap.length - 1;

  const elapsedTime = (diffTime > 0) ? diffTime : -diffTime;

  for(let i = minUnitIndex; i < maxUnitIndex; ++i) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const current = unitMap[i]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const next = unitMap[i + 1]!;
    if(elapsedTime < next.time - current.time / 2) {
      return current;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return unitMap[maxUnitIndex]!;
}

function diffToRelativeTimeString(
  diffTime: number, minimumUnit?: TimeUnit, locales?: string | string[], numericAuto?: boolean
): string {
  const unit = getTimeUnit(diffTime, minimumUnit);

  if(unit.name !== minimumUnit) {
    numericAuto = false;
  }

  return getRelativeTimeString(diffTime / unit.time, unit.name, locales, numericAuto);
}

function dateToRelativeTimeString(
  baseDate: Date, targetDate: Date, minimumUnit?: TimeUnit, locales?: string | string[], numericAuto?: boolean
): string {
  const baseTime = baseDate.getTime();
  const targetTime = targetDate.getTime();
  const diffTime = -(baseTime - targetTime); // -0 if baseTime === targetTime

  return diffToRelativeTimeString(diffTime, minimumUnit, locales, numericAuto);
}

export function toRelativeDateString(baseDate: Date, targetDate: Date, locales?: string | string[]): string {
  const baseDate0am = convertDateTo0am(baseDate);
  const targetDate0am = convertDateTo0am(targetDate);
  return dateToRelativeTimeString(baseDate0am, targetDate0am, 'day', locales, true);
}

export function toRelativeTimeString(baseDate: Date, targetDate: Date, locales?: string | string[]): string {
  return dateToRelativeTimeString(baseDate, targetDate, 'second', locales);
}
