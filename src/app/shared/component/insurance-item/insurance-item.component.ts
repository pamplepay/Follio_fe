import { Component, Input, OnInit } from '@angular/core';
import { LayoutToastService } from '../../../layout/toast/layout-toast.service';
import { ICommonInsurance, IInsurance } from '../../../core/model/common.model';
import { CommonService } from '../../../core/service/common/common.service';

@Component({
  selector:    'app-insurance-item',
  templateUrl: './insurance-item.component.html',
  styleUrls:   [ './insurance-item.component.scss' ]
})
export class InsuranceItemComponent implements OnInit {
  @Input() insuranceItem: any;
  @Input() isShowComment: boolean = false;
  @Input() isTag: boolean         = false;

  commonInsurance: ICommonInsurance;

  constructor(
    private _commonService: CommonService,
    private _toastService: LayoutToastService
  ) {
  }

  ngOnInit(): void {
    this._commonService.rxInsurance().subscribe(commonInsurance => {
      this.commonInsurance = commonInsurance;
    });
  }
}
