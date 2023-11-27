import { Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { toTitleCase } from 'codelyzer/util/utils';

export class Validator {

  static password(): ValidatorFn {
    return (c: AbstractControl) => {
      const password       = (c.value || '').replace(/[\\]/g, '\\');
      const validPassword1 = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!?@#$%~+-=:;_^&*\\|"`'])[A-Za-z\d!?@#$%~+-=:;_^&*\\|"`']{6,}$/;
      const validPassword2 = /[ㄱ-ㅎ가-힣ㅏ-ㅣ]/g;​

      if (validPassword1.test(password) === false) {
        return { 'notEqualPassword': { valid: false } };
      }
      if (validPassword2.test(password) === true) {
        return {
          koreanInPassword: false,
          message: '패스워드에 한글이 들어가 있습니다.',
        };
      }
      if (password.includes(' ') === true) {
        return {
          spaceInPassword: false,
          message: '패스워드에 빈공간이 들어가 있습니다.',
        };
      }

      return null;
    };
  }


  static password2(): ValidatorFn {
    return (c: AbstractControl) => {
      const password       = (c.value || '').replace(/[\\]/g, '\\');
      const regexKorean = /[ㄱ-ㅎ가-힣ㅏ-ㅣ]/g;​

      if (regexKorean.test(password) === true) {
        return {
          'koreanInPassword': {
            valid:   false,
            message: '패스워드에 한글이 들어가 있습니다.'
          }
        };
      }
      if (password.includes(' ') === true) {
        return {
          'spaceInPassword': {
            valid:   false,
            message: '패스워드에 띄어쓰기가 들어가 있습니다.'
          }
        };
      }

      let validCount = 0;

      const regexEngUpper = /[A-Z]/g;
      const regexEngLower = /[a-z]/g;​
      const regexNumber = /[0-9]/g;​
      const regexSpecial = /[!?@#$%~+\-=:;_^&*\\|"'`]/g;​

      // 영 대문자
      const validEngUpper = regexEngUpper.test(password);
      const validEngLower = regexEngLower.test(password);
      const validNumber = regexNumber.test(password);
      const validSpecial = regexSpecial.test(password);

      validCount += validEngUpper ? 1 : 0;
      validCount += validEngLower ? 1 : 0;
      validCount += validNumber ? 1 : 0;
      validCount += validSpecial ? 1 : 0;
      if (validCount < 3) {
        return { 'notEqualPassword': {
          valid: false,
          message: `영대문자 포함 : ${validEngUpper}, 영소문자 포함 : ${validEngLower}, 숫자 포함 : ${validNumber}, 특수문자 포함 : ${validSpecial}`
        } };
      }

      return null;
    };
  }

  // 타겟 날짜가 이후
  static targetDateGT(targetControl: AbstractControl): ValidationErrors {
    return (thisControl: AbstractControl) => {
      if (targetControl.value > thisControl.value) {
        return {
          'notOverDate': {
            valid:   false,
            message: '비교한 날짜가 이후가 아닙니다. >> ${targetControl.value} > ${thisControl.value}'
          }
        };
      }
      return null;
    };
  }

  // 탈겟 날짜가 이전
  static targetDateLT(targetControl: AbstractControl): ValidationErrors {
    return (thisControl: AbstractControl) => {
      if (targetControl.value < thisControl.value) {
        return {
          'notOverDate': {
            valid:   false,
            message: `비교되는 날짜가 이전이 아닙니다. >> ${targetControl.value} < ${thisControl.value}`
          }
        };
      }
    };
  }

  static passwordConfirm(passwordControl: AbstractControl | null): any {
    // return Validators.pattern(this.passwordPattern())
    return (c: AbstractControl) => {
      if (passwordControl?.value !== c.value) {
        return {
          notSamePassword: false,
          message: '패스워드가 같지 않습니다.'
        };
      }
      return null;
    };
  }

  static email(): ValidatorFn {
    // return Validators.pattern(this.emailPattern());
    return (c: AbstractControl) => {
      const value = c.value;
      if (!value) {
        return null;
      }

      const regexMobile = new RegExp(this.emailPattern());​

      if (regexMobile.test(value) === false) {
        return {
          email:   false,
          message: '이메일 형식이 아닙니다.'
        };
      }

      return null;
    }
  }

  static phone(): ValidatorFn {
    // return Validators.pattern(this.phonePattern());
    return (c: AbstractControl) => {
      const value = c.value;
      if (!value) {
        return null;
      }

      const regexMobile = new RegExp(this.phonePattern());​

      if (regexMobile.test(value) === false) {
        return {
          email:   false,
          message: '전화번호를 확인해 주세요.'
        };
      }

      return null;
    }
  }

  /**
   * 핸드폰 번호 vaildator!
   */
  static mobile(): ValidatorFn {
    // return Validators.pattern(this.mobilePattern());
    return (c: AbstractControl) => {
      const mobile = c.value;
      if (!mobile) {
        return null;
      }

      const regexMobile = new RegExp(this.mobilePattern());​

      if (regexMobile.test(mobile) === false) {
        return {
          mobile:   false,
          message: '숫자만 입력할 수 있어요.'
        };
      }

      return null;
    }
  }


  /**
   * 날짜 validator!
   */
  static date(): ValidatorFn {
    // return Validators.pattern(this.datePattern());
    return (c: AbstractControl) => {
      const value = c.value;
      if (!value) {
        return null;
      }

      const regex = new RegExp(this.datePattern());

      if (regex.test(value) === false) {
        return {
          number: false,
          message: '0000.00.00 형식으로 숫자만 입력해 주세요.'
        };
      }

      return null;
    }
  }

  /**
   * only num validator!
   */
  static num(): ValidatorFn {
    // return Validators.pattern(this.numPattern());
    return (c: AbstractControl) => {
      const value = c.value;
      if (!value) {
        return null;
      }

      const regex = new RegExp(this.numPattern());

      if (regex.test(value) === false) {
        return {
          number: false,
          message: '숫자만 입력할 수 있어요.'
        };
      }

      return null;
    }
  }

  static minLength(minLengthSize: number): ValidatorFn {
    return (c: AbstractControl) => {
      const value = c.value;
      if (value.length < minLengthSize) {
        return {
          minLength: false,
          message: `${minLengthSize}`
        };
      }

      return null;
    }
  }

  /**
   * only 영어 validator!
   */
  static eng(): ValidatorFn {
    return Validators.pattern(this.engPattern());
  }

  static engSpace(): ValidatorFn {
    return Validators.pattern(this.engSpacePattern());
  }

  /**
   * only 한글 validator!
   */
  static kor(): ValidatorFn {
    // return Validators.pattern(this.korPattern());
    return (c: AbstractControl) => {
      const value = c.value;
      const regex = new RegExp(this.korPattern());​

      if (regex.test(value) === false) {
        return {
          korean: false,
          message: '한글을 입력해 주세요.'
        };
      }

      return null;
    }
  }

  /**
   * 생년월일 validator!
   */
  static birthday(): ValidatorFn {
    return Validators.pattern(this.datePattern());
  }

  /**
   * 생년월일 validator!
   */
  static dateWithSeparator(): ValidatorFn {
    return Validators.pattern(this.dateWithSeparatorPattern());
  }

  static hourAndMinute(): ValidatorFn {
    return Validators.pattern(this.hourAndMinutePattern())
  }

  /**
   * 월 validator!
   */
  static month(): ValidatorFn {
    return Validators.pattern(this.monthPattern());
  }

  static cardNo(): ValidatorFn {
    return Validators.pattern(this.cardNoPattern());
  }

  static cardPeriodMonth(): ValidatorFn {
    return Validators.pattern(this.cardPeriodMonthPattern());
  }

  static cardPeriodYear(): ValidatorFn {
    return Validators.pattern(this.cardPeriodYearPattern());
  }

  static regNo(): ValidatorFn {
    return Validators.pattern(this.regNoPattern());
  }

  static excludedSpecialWord(): ValidatorFn {
    return Validators.pattern(this.excludedSpecialPattern());
  }

  static excludedKor(): ValidatorFn {
    return Validators.pattern(this.excludedKorPattern());
  }

  static kakaotalkOpenChatLink(): ValidatorFn {
    console.dir(Validators.pattern(this.kakaotalkOpenChatLinkPattern()));
    return Validators.pattern(this.kakaotalkOpenChatLinkPattern());
  }


  /******************************    pattern     ****************************/



  private static cardPeriodMonthPattern(): string {
    return '^([0][1-9])|([1][0-2])$';
  }

  private static cardPeriodYearPattern(): string {
    return '^([1-2][0-9])$';
  }

  private static cardNoPattern(): string {
    return '^[3,4,5,9][0-9]{15}$';
    // return '(5[1-5]\d{14})|(4\d{12})(\d{3}?)|3[47]\d{13}|(6011\d{12})';
  }

  private static bizNoPattern(): string {
    return '^([0-9]{10})$';
  }

  private static regNoPattern(): string {
    return '^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))[1-6]$';
  }

  // 이멜 pattern
  private static emailPattern(): string {
    // return  '(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)';
    return '[_0-9a-zA-Z]([-_\\.]?[_0-9a-zA-Z])*@[-_\\.0-9a-zA-Z]*\\.[a-zA-Z]{2,9}';
  }

  // 일반 전화 pattern
  private static phonePattern(): string {
    return '((0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|70))-([0-9]{3,4})-([0-9]{4}))|((0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|70))([0-9]{7,8}))';
  }

  // 핸드폰 번호 pattern
  private static mobilePattern(): string {
    // return '^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$';
    // return '^(?:(010-\d{4})|(01[1|6|7|8|9]-\d{3,4}))-(\d{4})$';
    // return '01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$';
    // return '[0-9]{10,16}'
    // return '(010[0-9]{8})|(01[1|6|7|8|9][0-9]{7,8})';
    return '((?:(010-[0-9]{4})|(01[1|6|7|8|9]-[0-9]{3,4}))-([0-9]{4}))$|((010[0-9]{8})|(01[1|6|7|8|9][0-9]{7,8}))';
  }

  private static numPattern(): string {
    return '^[-0-9]+$';
  }

  // 영어 패턴
  private static engPattern(): string {
    return '^[A-Za-z]*$';
  }

  private static engSpacePattern(): string {
    return '^[A-Za-z\\s]*$';
  }

  // 날짜 패턴
  private static datePattern(): string {
    // return '^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$';
    return '^((19[0-9]{2}|2[0-9]{3})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1]))$' + '|' +
      '^((19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1]))$' + '|' +
      '^((19[0-9]{2}|2[0-9]{3}).(0[1-9]|1[012]).(0[1-9]|[12][0-9]|3[0-1]))$';
  }

  // 날짜 패턴
  private static dateWithSeparatorPattern(): string {
    // return '^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$';
    return '((19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1]))';
  }

  private static hourAndMinutePattern(): string {
    return '([0-1][0-9]|2[0-3]):[0-5][0-9]';
  }

  private static monthPattern(): string {
    return '(0[1-9]|1[012])';
  }

  private static excludedSpecialPattern(): string {
    return '^[a-zA-Z0-9\\s]+$';
  }

  private static excludedKorPattern(): string {
    return '^[^가-힣ㄱ-ㅎㅏ-ㅣ]+$';
  }

  private static korPattern() {
    return '^[가-힣ㄱ-ㅎㅏ-ㅣ]+$';​
  }

  private static kakaotalkOpenChatLinkPattern() {
    return '^https:\\/\\/open.kakao.com\\/o\\/\\w*$';​
  }
}
