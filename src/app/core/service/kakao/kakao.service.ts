import { Injectable } from '@angular/core';

interface IkakaoLoginSucceed {
  access_token: string;

  expires_in: number;

  refresh_token: string;

  refresh_token_expires_in: number;

  scope: string;

  token_type: string;
}

interface IKakaoLoginResult {
  nickname: string;
  email: string;
  thumbnail_image: string;
  isError?: boolean;
  error?: any;
}

declare const Kakao: any;

@Injectable({
  providedIn: 'root'
})
export class KakaoService {

  constructor() {
  }

  async login() {
    const kakao_login_response = await this.kakao_login();
    if (kakao_login_response?.isError) {
      return kakao_login_response;
    }
    const kakao_auth_response = await this.kakao_auth();
    if (kakao_auth_response?.isError) {
      return kakao_login_response;
    }

    const result: IKakaoLoginResult = {
      nickname: kakao_auth_response.kakao_account.profile.nickname,
      email: kakao_auth_response.kakao_account.email,
      thumbnail_image: kakao_auth_response.kakao_account.profile?.profile_image_url,
    };

    return result;
  }

  async kakao_login() {
    if (!Kakao) {
      return;
    }

    return await new Promise<any>((resolve, reject) => {
      Kakao.Auth.login({
        success: (response: IkakaoLoginSucceed) => {
          resolve(response);
        },
        fail:    (error) => {
          reject({
            'isError': true,
            error
          });
        }
      });
    });
  }

  async kakao_auth() {
    if (!Kakao) {
      return;
    }

    return await new Promise<any>((resolve, reject) => {
      Kakao.API.request({
        url:     '/v2/user/me',
        success: (response) => {
          console.log('kakao user', response);
          resolve(response);
        },
        fail:    (error) => {
          console.log({ error });
          reject({
            'isError': true,
            error
          });
        }
      });
    });
  }

  async kakao_logout() {
    if (!Kakao) {
      return;
    }

    return await new Promise((resolve) => {
      if (Kakao.Auth.getAccessToken()) {
        Kakao.Auth.logout(() => {
          resolve(true);
        });
        return;
      } else {
        resolve(false);
        return;
      }
    });
  }
}
