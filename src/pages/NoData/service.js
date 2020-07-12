import request from '@/utils/request';

export async function queryNodatas() {
  return request('/api/v1/nodata', {
    method: 'GET',
  });
}

export async function deleteNodata(nodataID) {
  return request(`/api/v1/nodata/${nodataID}`, {
    method: 'DELETE',
  });
}

export async function createNodata(payload) {
  return request(`/api/v1/nodata/`, {
    method: 'POST',
    data: payload,
  });
}

export async function updateNodata(payload) {
  return request(`/api/v1/nodata/`, {
    method: 'PUT',
    data: payload,
  });
}
