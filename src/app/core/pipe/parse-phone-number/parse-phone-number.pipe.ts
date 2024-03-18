import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parsePhoneNumberPipe'
})

export class ParsePhoneNumberPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value?.length === 11) {
      const result = [];
      result.push(value.slice(0,3),value.slice(3,7),value.slice(7,11));
      return result.join('-');
    }
    return value;
  }
}
