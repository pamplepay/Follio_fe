export interface IInsurance {
  id: number;

  name: string;

  order: number;
}

export interface IDetail {
  id: number;

  name: string;

  order: number;

  sub_category: number;

  non_renewal_old_list?: number[];

  renewal_old_list?: number[];

  total_premium?: number;

  total_renewal_premium?: number;

  total_non_renewal_premium?: number;

  total_premium_list?: number[];

  existing?: any;

  suggest?: any;
}

export interface ISubCategory {
  id: number;

  detail_list: IDetail[];

  insurance_type: number;

  name: string;

  order: number;

  category: number;
}

export interface ICategory {
  id: number;

  sub_category_list: ISubCategory[];

  insurance_type: number;

  name: string;

  order: number;
}

export interface ICommonInsurance {
  insurance_list: IInsurance[];
  life_insurance_list: IInsurance[];
  loss_insurance_list: IInsurance[];

  insuranceListObj: any;

  paymentPeriodType: any;
  paymentPeriodTypeList: any;

  warrantyPeriodType: any;
  warrantyPeriodTypeList: any;

  caseWarrantyPeriodType: any;
  caseWarrantyPeriodTypeList: any;

  casePaymentPeriodType: any;
  casePaymentPeriodTypeList: any;

  refundType: any;
  refundTypeList: any;

  categories: ICategory[];
  analysis_categories: ICategory[];
}

