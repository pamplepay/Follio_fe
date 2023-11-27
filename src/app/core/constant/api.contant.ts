export const ApiUrl = {
  kakaoLogin: 'rest-auth/kakao_login/',
  signup:     'rest-auth/registration/',
  login:      'rest-auth/login/',
  // login:          'dev/login/',
  logout:         'rest-auth/logout/',
  findPassword:   'rest-auth/password/reset/',
  changePassword: 'rest-auth/password/change/',
  user:           'rest-auth/user/',
  findEmail:      'rest-auth/find/email/',

  contact:           'contact/',
  profileMe:         'accounts/profile/me/',
  phoneNumber:       'accounts/phonenumber/',
  phoneNumberMe:     'accounts/phonenumber/me/',
  phoneNumberResend: 'accounts/phonenumber/resend/',
  phoneNumberVerify: 'accounts/phonenumber/verify/',
  requestDeleteUser: 'accounts/request_delete_user/',

  createCustomer:                    'customer/',
  getCustomerList:                   'customer/',
  getCustomer:                       'customer/:id/',
  updateCustomer:                    'customer/:id/',
  deleteCustomer:                    'customer/:id/',
  getMedicalHistoryListWithCustomer: 'customer/:id/medical_history_list/',
  getCustomerInsuranceList:          'customer/:id/insurance_list/',
  getGroupCustomerList:              'customer/:id/group_customer_list/',
  updateGroupCustomer:               'customer/:id/update_group_customer/',
  analysis:                          'customer/:id/analysis/',
  compare:                           'customer/:id/compare/',

  createCustomerMedicalHistory:  'customer_medical_history/',
  getCustomerMedicalHistoryList: 'customer_medical_history/',
  getCustomerMedicalHistory:     'customer_medical_history/:id/',
  updateCustomerMedicalHistory:  'customer_medical_history/:id/',
  deleteCustomerMedicalHistory:  'customer_medical_history/:id/',

  getCommonInsurance: 'common/insurance/',

  createCustomerInsurance:   'customer_insurance/',
  getCustomerInsurance:      'customer_insurance/:id/',
  updateCustomerInsurance:   'customer_insurance/:id/',
  deleteCustomerInsurance:   'customer_insurance/:id/',
  customerInsuranceAnalysis: 'customer_insurance/:id/analysis/',
  getInsuranceTemplateList: 'customer_insurance/template',

  copyCustomerInsurance:            'customer/:id/copy_insurance/',
  getLastViewCustomerList:          'customer/last_view_list/',
  getLastViewCustomerInsuranceList: 'customer_insurance/last_view_list/',
  getLastViewInsuranceTemplateList: 'customer_insurance/last_view_template_list/',

  membershipList: 'membership',
  getMembership:  'membership/:id/',
  userMembership: 'user_membership/',
  payment:        'payment/',
  recommendCode:  'recommend_code/'


};

