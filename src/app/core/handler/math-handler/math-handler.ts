export class MathHandler {
  /*
  * Rate is the interest rate per period.
 Nper is the total number of payment periods in an annuity.
 Pmt is the payment made each period; it cannot change over the life of the annuity. Pmt must be entered as a negative number.
 Pv is the present value, or the lump-sum amount that a series of future payments is worth right now. If pv is omitted, it is assumed to be 0 (zero). PV must be entered as a negative number.
 Type is the number 0 or 1 and indicates when payments are due. If type is omitted, it is assumed to be 0 which represents at the end of the period.  If payments are due at the beginning of the period, type should be 1.

Rate는 기간당 이자율입니다.
Nper는 연금의 총 지급 기간입니다.
Pmt는 각 기간마다 지급되는 지급액이며, 연금 연수에 따라 변경될 수 없습니다. Pmt는 음수로 입력해야 합니다.
Pv는 현재 가치 또는 일련의 미래 지급 가치가 있는 일시불 금액입니다. pv를 생략하면 0으로 가정합니다. PV는 음수로 입력해야 합니다.
Type은 숫자 0 또는 1이며 지급 기한이 언제인지 나타냅니다. 유형을 생략하면 기간 말에 해당하는 0으로 가정합니다. 지급 기한이 만료된 경우 유형은 1이어야 합니다.

FV(0.03/12, 180,-30000, 0, 0)
=> "6809180.70"

* */

  static FV(rate, nper, pmt, pv, type) {
    const pow = Math.pow(1 + rate, nper);
    let fv    = null;
    if (rate) {
      fv = (pmt * (1 + rate * type) * (1 - pow) / rate) - pv * pow;
    } else {
      fv = -1 * (pv + pmt * nper);
    }
    return fv.toFixed(2);
  }
}
