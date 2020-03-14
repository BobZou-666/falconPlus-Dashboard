import request from '@/utils/request';
import moment from 'moment';

export async function queryEventCases() {
  return request('/api/v1/alarm/eventcases', {
    method: 'POST',
    data: {
      endTime: moment().unix(),
    },
  });
}
