export interface IUser {
  id: number;
  name: string;
  email: string;
  company: string;
  phone_number?: string;
  image?: any;
  key: string;
  created_at: string;
  updated_at: string;
  is_first_visit: boolean;
  recommend_user?: any;
  user_membership?: any;
  is_admin?: boolean;
  recommend_code?: string;
  remain_add_user_count?: number;
}
