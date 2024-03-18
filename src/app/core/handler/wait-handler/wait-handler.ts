export class WaitHandler {
  static wait(check: () => any, callback: () => void, limitSecond?: number) {
    if (!limitSecond) {
      limitSecond = 1000;
    }

    if (limitSecond < 0) {
      console.log('wait 시간초과');
      return;
    }

    limitSecond -= 300;

    if (check()) {
      callback();
    } else {
      setTimeout(() => {
        this.wait(check, callback, limitSecond);
      }, 300);
    }
  }
}
