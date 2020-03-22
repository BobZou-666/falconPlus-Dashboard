import { queryEventCases, queryEventCaseById, queryEventsById } from '@/pages/Alarm/service';

export default {
  namespace: 'alarm',

  state: {
    EventCases: [],
    EventCaseDetail: {},
    Events: [],
  },

  effects: {
    *queryEventCases(_, { call, put }) {
      const response = yield call(queryEventCases);
      yield put({
        type: '_queryEventCases',
        payload: response,
      })
    },
    *queryEventCaseById({payload, callback}, { call, put }) {
      const response = yield call(queryEventCaseById, payload);
      yield put({
        type: '_queryEventCaseById',
        payload: response,
      });

      if (callback){
        callback()
      }
    },
    *queryEventsById({payload, callback}, { call, put }) {
      const response = yield call(queryEventsById, payload);
      yield put({
        type: '_queryEventsById',
        payload: response,
      });

      if (callback){
        callback()
      }
    },
  },

  reducers: {
    _queryEventCases(state, action) {
      return {
        ...state,
        EventCases: action.payload,
      };
    },
    _queryEventCaseById(state, action){
      let eventCaseDetail = [];
      if (action.payload.length === 1){
        eventCaseDetail= action.payload[0]
      }
      return {
        ...state,
        EventCaseDetail: eventCaseDetail,
      };
    },
    _queryEventsById(state, action){
      return {
        ...state,
        Events: action.payload,
      };
    }
  },
}
