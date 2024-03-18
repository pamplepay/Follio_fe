export interface CaseList {
  id: number;
  assurance_amount: number;
  premium: number;
  payment_period_type: number;
  payment_period: number;
  warranty_period_type: number;
  warranty_period: string;
  insurance: number;
  detail: number;
}

export interface IInsuranceTemplate {
  id: number;
  case_list?: CaseList[];
  insurance_type: number;
  name: string;
  image?: string;
  payment_period_type: number;
  payment_period: number;
  warranty_period_type: number;
  warranty_period: number;
  monthly_earned_premium: number;
  old: number;
  expiry_date?: any;
  monthly_assurance_premium: number;
  monthly_renewal_premium: number;
  monthly_premiums: number;
  monthly_contract_premium?: any;
  renewal_growth_rate: number;
  insurance: number;
  user: number;
  tags: any[];
}
