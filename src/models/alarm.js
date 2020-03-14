import { queryEventCases } from '@/pages/Alarm/service';
import { notification } from 'antd';

export default {
  namespace: 'alarm',

  state: {
    EventCases: [],
  },

  effects: {
    *queryEventCases(_, { call, put }) {
      const response = yield call(queryEventCases);
      yield put({
        type: '_queryEventCases',
        payload: response,
      })
    },
  },

  reducers: {
    _queryEventCases(state, action) {
      return {
        ...state,
        EventCases: action.payload,
      };
    },
  },
}
