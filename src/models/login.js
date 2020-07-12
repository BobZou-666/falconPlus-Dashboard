import { stringify } from 'querystring';
import { router } from 'umi';
import { AccountLogout, AccountLogin } from '@/services/login';
import { setAuthority, setApiToken } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(AccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.name !== undefined && response.sig !== undefined) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        router.replace(redirect || '/');
        router.go()
      }
    },

    *logout({}, { call, put }) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      yield call(AccountLogout);
      if (window.location.pathname !== '/login' && !redirect) {
        router.replace({
          pathname: '/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
        router.go()
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setApiToken(payload);
      if (payload.admin){
        setAuthority("admin");
      } else {
        setAuthority("user");
      }

      return { ...state};
    },
  },
};
export default Model;
