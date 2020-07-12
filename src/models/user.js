import { queryCurrent, query as queryUsers } from '@/services/user';
import { setCurrentUser } from '@/utils/authority';
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      let response = undefined
      try {
        response = yield call(queryCurrent);
      } catch (e) {
        return false
      } finally {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }
      return true
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      setCurrentUser(action.payload);
      return { ...state, currentUser: action.payload || {} };
    },
  },
};
export default UserModel;
