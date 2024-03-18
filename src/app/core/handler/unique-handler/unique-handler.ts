export class UniqueHandler {
  static getUniqueStringList(list: string[]): string[] {

    const uniqueList = list.reduce((a, b) => {
      if (a.indexOf(b) < 0 ) { a.push(b); }
      return a;
    }, []);

    return uniqueList;
  }

  static getUniqueObjectList(list: any[], key: string): any[] {
    const result = [];
    const keyList = [];

    list.forEach(item => {
      if (keyList.indexOf(item[key]) === -1) {
        keyList.push(item[key]);
        result.push(item);
      }
    });

    return result;
  }
}
