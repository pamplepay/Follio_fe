import * as moment from 'moment';

export class AgeHandler {
  static getAgeByBirthDay(birthday: string, referenceDate?: string): number {
    const nowDate = referenceDate ? moment(referenceDate) : moment();
    const birth   = moment(birthday);

    const birthdayYear  = birth.get('year');
    const birthdayMonth = birth.get('month');
    const birthdayDay   = birth.get('date');

    const nowYear  = nowDate.get('year');
    const nowMonth = nowDate.get('month');
    const nowDay   = nowDate.get('date');

    const gapMonth = nowMonth - birthdayMonth;
    const gapDay   = nowDay - birthdayDay;

    let age = nowYear - birthdayYear;

    if (gapMonth < 0) {
      age = age - 1;
    }
    if (gapMonth === 0) {
      if (gapDay < 0) {
        age = age - 1;
      }
    }
    return age;
  }
}
