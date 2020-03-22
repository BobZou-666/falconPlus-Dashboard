import request from '@/utils/request';

export async function queryNodatas() {
  return request('/api/v1/nodata', {
    method: 'GET',
  });
}
