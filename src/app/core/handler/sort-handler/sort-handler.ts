export class SortHandler {
  static KOR_ENG_ETC(list: any[], key?: string): any[] {
    if ((list instanceof Array) === false) {
      return [];
    }

    const korList = [];
    const engList = [];
    const etcList = [];
    let result = [];

    if (key) {
      if ((list[0] instanceof Object) === false) {
        return [];
      }

      list.forEach(item => {
        if (item[key] < 'a') {
          etcList.push(item);
        } else if (item[key] < 'ㄱ') {
          engList.push(item);
        } else {
          korList.push(item);
        }
      });

    } else {
      list.forEach(string => {
        if (string < 'a') {
          etcList.push(string);
        } else if (string < 'ㄱ') {
          engList.push(string);
        } else {
          korList.push(string);
        }
      });
    }

    result = result.concat(korList);
    result = result.concat(engList);
    result = result.concat(etcList);
    return result;
  }

  // 오름차순 Ascending, 내림차순 Descending
  static ascendingObjectWithKey(list: any[], key: string) {
    if ((list instanceof Array) === false) {
      return;
    }

    list.sort((a, b) => {
      const A = a[key];
      const B = b[key];

      if (A === null || A === '' || A === undefined) {
        return 1;
      }
      if (B === null || B === '' || B === undefined) {
        return -1;
      }
      if (A < B) {
        return -1;
      }
      if (A > B) {
        return 1;
      }
      return 0;
    });
  }

  static descendingObjectWithKey(list: any[], key: string) {
    if ((list instanceof Array) === false) {
      return;
    }

    list.sort((a, b) => {
      const A = a[key];
      const B = b[key];

      if (A === null || A === '' || A === undefined) {
        return -1;
      }
      if (B === null || B === '' || B === undefined) {
        return 1;
      }
      if (A > B) {
        return -1;
      }
      if (A < B) {
        return 1;
      }
      return 0;
    });
  }

  static ascendingObjectByNumberValue(list: any[], key: string) {
    if ((list instanceof Array) === false) {
      return;
    }

    list.sort((a, b) => {
      const A = a[key];
      const B = b[key];

      if (A === null || A === '' || A === undefined) {
        return -1;
      }
      if (B === null || B === '' || B === undefined) {
        return 1;
      }
      if (A < B) {
        return -1;
      }
      if (A > B) {
        return 1;
      }
      return 0;
    });
  }

  static descendingObjectByNumberValue(list: any[], key: string) {
    if ((list instanceof Array) === false) {
      return;
    }

    list.sort((a, b) => {
      const A = a[key];
      const B = b[key];

      if (A === null || A === '' || A === undefined) {
        return 1;
      }
      if (B === null || B === '' || B === undefined) {
        return -1;
      }
      if (A > B) {
        return -1;
      }
      if (A < B) {
        return 1;
      }
      return 0;
    });
  }

  static descending(list: any[]) {
    if ((list instanceof Array) === false) {
      return;
    }

    list.sort((a: any, b: any) => {
      if (a > b) {
        return -1;
      }
      if (a < b) {
        return 1;
      }
      return 0;
    });
  }

  static ascending(list: any[]) {
    if ((list instanceof Array) === false) {
      return;
    }

    list.sort((a: any, b: any) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
  }
}
