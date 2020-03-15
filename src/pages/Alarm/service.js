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

export async function queryEventCaseById(eventCaseId) {
  return request(`/api/v1/alarm/eventcases?event_id=${eventCaseId}`, {
    method: 'GET',
  });
}

export async function queryEventsById(eventCaseId) {
  return request(`/api/v1/alarm/events?event_id=${eventCaseId}`, {
    method: 'GET',
  });
}
