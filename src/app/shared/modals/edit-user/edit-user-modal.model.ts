export interface EditUserApiCondition {
  name?: string;
  email?: string;
  company?: string;
  phone_number?: string;
}

export interface ChangePasswordApiCondition {
  old_password: string;
  new_password1: string;
  new_password2: string;
}
