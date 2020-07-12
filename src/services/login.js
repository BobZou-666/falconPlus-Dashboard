import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function AccountLogin(params) {
  return request('/api/v1/user/login', {
    method: 'POST',
    data: params,
  });
}

export async function AccountLogout() {
  return request('/api/v1/user/logout', {
    method: 'GET'
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
