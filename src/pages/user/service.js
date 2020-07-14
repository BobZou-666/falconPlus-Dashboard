import request from '@/utils/request';

export async function queryUsers() {
  return request(`/api/v1/user/users`, {
    method: 'GET',
  });
}

export async function updateUserInfo(id, payload) {
  return request(`/api/v1/user/u/${id}`, {
    method: 'PUT',
    data: payload,
  });
}

export async function createUser(payload) {
  return request(`/api/v1/user/create`, {
    method: 'POST',
    data: payload,
  });
}

export async function changeUserRole(payload) {
  return request(`/api/v1/admin/change_user_role`, {
    method: 'PUT',
    data: payload,
  });
}

export async function changeUserPassword(payload) {
  return request(`/api/v1/admin/change_user_passwd`, {
    method: 'PUT',
    data: payload,
  });
}

export async function deleteUser(payload) {
  return request(`/api/v1/admin/delete_user`, {
    method: 'DELETE',
    data: payload,
  });
}


