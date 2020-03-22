import { queryNodatas } from '@/pages/NoData/service';

export default {
  namespace: 'nodata',

  state: {
    Nodatas: [],
  },

  effects: {
    *queryNodatas({}, { call, put }) {
      const response = yield call(queryNodatas);
      yield put({
        type: '_queryNodatas',
        payload: response,
      })
    },
  },

  reducers: {
    _queryNodatas(state, action) {
      return {
        ...state,
        Nodatas: action.payload,
      };
    },
  },
}
