import request from '@/utils/request';

export async function queryUsers() {
  return request(`/api/v1/user/users`, {
    method: 'GET',
  });
}
