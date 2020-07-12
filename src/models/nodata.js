import { queryNodatas } from '@/pages/NoData/service';

export default {
  namespace: 'nodata',

  state: {
    Nodatas: [],
  },

  effects: {
    *queryNodatas({callback}, { call, put }) {
      const response = yield call(queryNodatas);
      yield put({
        type: '_queryNodatas',
        payload: response,
      })

      if (callback){
        callback()
      }
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
