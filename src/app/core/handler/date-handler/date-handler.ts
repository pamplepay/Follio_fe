import * as moment from 'moment';

moment.locale('ko');

export class DateHandler {

  static getDateRange(fromNumber: number, toNumber: number, reverse?: boolean) {
    const numberList: string[] = [];

    for (let i = fromNumber; i <= toNumber; i++) {

      numberList.push(i < 10 ? '0' + i : i + '');
    }

    if (reverse) {
      numberList.sort((a: string, b: string) => parseInt(b, 10) - parseInt(a, 10));
    }

    return numberList;
  }

  static addMinutes(dateString: string, minutes: number, format: string = 'YYYY-MM-DD HH:mm:ss') {
    return moment(dateString).add(minutes, 'minutes').format(format);
  }

  static addHours(dateString: string, hours: number, format: string = 'YYYY-MM-DD HH:mm:ss') {
    return moment(dateString).add(hours, 'hours').format(format);
  }

  static addDate(date: Date | string, days: number): Date {
    const result = moment(date).add(days, 'days').format();
    return new Date(result);
  }

  static addDay(date: Date | string, days: number, format: string = 'YYYY-MM-DD'): string {
    return moment(date).add(days, 'days').format(format);
  }

  static addMonth(date: Date | string, months: number, format: string = 'YYYY-MM-DD'): string {
    return moment(date).add(months, 'months').format(format);
  }

  static addYear(date: Date | string, years: number, format: string = 'YYYY-MM-DD'): string {
    return moment(date).add(years, 'years').format(format);
  }

  static subtractDate(date: Date | string, days: number, format: string = 'YYYY-MM-DD') {
    const result = moment(date).subtract(days, 'days').format(format);
    return new Date(result);
  }

  static getDaysBetweenTwoDate(date: Date | string, compareDate: Date | string): number {
    const day   = 1000 * 60 * 60 * 24;
    const date1 = moment(date);
    const date2 = moment(compareDate);
    return Math.floor(Math.abs(date1.diff(date2)) / day);
  }

  static getDaysBetweenTwoDateToUpper(date: Date | string, compareDate: Date | string): number {
    const day   = 1000 * 60 * 60 * 24;
    const date1 = moment(date);
    const date2 = moment(compareDate);
    return Math.ceil(Math.abs(date1.diff(date2)) / day);

  }

  static getMonthsBetweenTwoDate(date: Date | string, compareDate: Date | string): number {
    const date1 = moment(date);
    const date2 = moment(compareDate);
    return Math.floor(Math.abs(date1.diff(date2, 'months')));
  }

  static format(date: string, format: string = 'YYYY-MM-DD', locale?: string) {
    let formatDate = '';

    if (locale) {
      formatDate = moment(date).locale(locale).format(format);
    } else {
      formatDate = moment(date).format(format);
    }

    return formatDate;
  }

  static stringDateFormat(date: string, format: string = 'YYYY-MM-DD', locale?: string) {
    let formatDate = '';

    if (locale) {
      formatDate = moment(date).locale(locale).format(format);
    } else {
      formatDate = moment(date).format(format);
    }

    return formatDate;
  }

  static period({ date, period = 0, units = 'd', format = 'YYYY-MM-DD HH:mm' }: {
    date: Date, period?: number, units?: moment.unitOfTime.DurationConstructor, format?: string
  }) {
    return moment(date).add(period, units).format(format);
  }

  static formatObject(date: Date, period: number = 0, units: moment.unitOfTime.DurationConstructor = 'd'): any {
    const format     = `YYYY-MM-DD`;
    const momentDate = moment(date).add(period, units).format(format).split('-');

    return {
      year:  momentDate[0],
      month: momentDate[1],
      day:   momentDate[2]
    };
  }

  static formatAddMinusSeparator(date: string) {
    const result = moment(date).format('YYYY-MM-DD');
    return result;
  }

  static dateToYoil(date: Date): string {
    const yoil = moment(date).format('dd');
    return yoil;
  }

  static getYoil(dateString: string, locale?: string): string {
    return moment(dateString).format('dd');
  }

  static getShortEngYoil(dateString: string) {
    return [
      'SUN',
      'MON',
      'TUE',
      'WED',
      'THU',
      'FRI',
      'SAT'
    ][moment(dateString).format('d')];
  }

  static makeStrToDate(dateString: string): Date {
    if (dateString.length === 14) {
      const year    = parseInt(dateString.substring(0, 4), 10);
      const month   = parseInt(dateString.substring(4, 6), 10) - 1;
      const day     = parseInt(dateString.substring(6, 8), 10);
      const hours   = parseInt(dateString.substring(8, 10), 10);
      const minutes = parseInt(dateString.substring(10, 12), 10);
      const seconds = parseInt(dateString.substring(12, 14), 10);

      return new Date(year, month, day, hours, minutes, seconds);
    }

    return null;
  }

  static makeStrToStringDate(dateString: string): string {
    if (dateString.length === 14) {
      const year    = parseInt(dateString.substring(0, 4), 10);
      const month   = parseInt(dateString.substring(4, 6), 10) - 1;
      const day     = parseInt(dateString.substring(6, 8), 10);
      const hours   = parseInt(dateString.substring(8, 10), 10);
      const minutes = parseInt(dateString.substring(10, 12), 10);
      const seconds = parseInt(dateString.substring(12, 14), 10);

      return moment(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`).format('YYYY-MM-DD HH:mm:ss');
    }

    return '';
  }

  static getDate(dateString: string): string {
    if (!dateString) {
      return '';
    }

    return moment(dateString).format('YYYY-MM-DD');
  }

  // 초 제거(date string 에서)
  static removeSecondsInDateString(dateString: string): string {
    if (!dateString) {
      return '';
    }
    const date = moment(dateString).format('YYYY-MM-DD HH:mm');
    return date;
  }

  static isOverNow(compare: Date | string): boolean {
    const now          = moment();
    const comparedTime = moment(compare);
    return comparedTime.valueOf() < now.valueOf();
  }

  static changeMillisecondsIntoStringDateMMDD(milliseconds: number): string {
    if (milliseconds !== 0 && !milliseconds) {
      return '';
    }

    const time = moment(milliseconds).format('HH:mm');
    return time;
  }

  static getYear(dateString: string): string {
    if (!dateString) {
      return '';
    }

    const year = moment(dateString).format('YYYY');
    return year;
  }

  static getNowYear(): number {
    return moment().get('year');
  }

  static getNowMonth(): string {
    console.log(moment().month('04').format('MM'));
    return moment().format('MM');
  }

  static getMonth(dateString: string): string {
    if (!dateString) {
      return '';
    }

    const month = moment(dateString).format('MM');
    return month;
  }

  static getDay(dateString: string): string {
    if (!dateString) {
      return '';
    }

    const day = moment(dateString).format('DD');
    return day;
  }

  static getWeekday(dateString: string): string {
    if (!dateString) {
      return '';
    }

    const weedkay = moment(dateString).format('d');
    return weedkay;
  }

  static getTime(dateString: string): string {
    if (!dateString) {
      return '';
    }

    const time = moment(dateString).format('LT');
    return time;
  }

  static getHour24(dateString: string): string {
    if (!dateString) {
      return '';
    }
    return moment(dateString).format('HH');
  }

  static getHour12(dateString: string): string {
    if (!dateString) {
      return '';
    }
    return moment(dateString).format('hh');
  }

  static getHourMinutes(dateString: string): string {
    if (!dateString) {
      return '';
    }

    const time = moment(dateString).format('HH:mm');
    return time;
  }

  static getTimeWithAmpmEN(dateString: string) {
    return moment(dateString).locale('en').format('A hh:mm');
  }

  static getTimeWithAmpmKO(dateString: string) {
    return moment(dateString).locale('ko').format('A hh:mm');
  }

  static getNowDate(format: string = 'YYYY-MM-DD', locale?: string): string {
    let nowDate = '';
    if (locale) {
      nowDate = moment().locale(locale).format(format);
    } else {
      nowDate = moment().format(format);
    }
    return nowDate;
  }

  static getMillisecond(dateString: string) {
    return moment(dateString).valueOf();
  }
}
