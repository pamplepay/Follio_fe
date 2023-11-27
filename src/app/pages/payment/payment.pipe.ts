import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentStatus'
})

export class PaymentStatusPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {

    switch (value) {
      case 1:
        return '결제 완료';
      case -1:
        return '결제 대기 중';
      case -2:
        return '결제 취소';
      case -3:
        return '결제 실패';
      case -4:
        return '결제 환불';
    }
  }
}
