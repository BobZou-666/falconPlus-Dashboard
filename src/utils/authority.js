import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority(str) {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('authority') : str; // authorityString could be admin, "admin", ["admin"]

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  }

  return authority;
}

export function getAPIToken() {
  return localStorage ? localStorage.getItem('apiToken') : null;
}

export function getCurrentUser() {
  const currentUser =  localStorage ? localStorage.getItem('currentUser') : null;
  if (currentUser !== null){
    return JSON.parse(currentUser);
  }
  return {}
}

export function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user)); // auto reload
}

export function setApiToken(apiToken) {
  localStorage.setItem('apiToken', JSON.stringify(apiToken)); // auto reload
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('authority', JSON.stringify(proAuthority)); // auto reload

  reloadAuthorized();
}
