export class CopyHandler {
  public static deepCopy(oldObj: any) {
    var newObj = oldObj;
    if (oldObj && typeof oldObj === 'object') {
      newObj = Object.prototype.toString.call(oldObj) === '[object Array]' ? [] : {};
      for (var i in oldObj) {
        newObj[i] = this.deepCopy(oldObj[i]);
      }
    }
    return newObj;
  }

  public static cloneObject(obj: any) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    let temp = obj instanceof Array ? [] : {};
    for (const key of Object.keys(obj)) {
      temp[key] = this.cloneObject(obj[key]);
    }

    return temp;
  }

  /**
   *
   * @param obj1 이전 오브젝트
   * @param obj2 합칠 오브젝트
   */
  public static deepMerge(obj1: any, obj2: any) {
    for (let p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor == Object) {
          obj1[p] = this.deepMerge(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch (e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];
      }
    }

    return obj1;
  }
}
