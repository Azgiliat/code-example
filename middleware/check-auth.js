export default function ({store, redirect, route}) {
  switch (route.path) {
    case '/profile':
      !store.getters['global/getIsLogged'] && redirect('/profile/login');
      break;
    case '/profile/login':
      store.getters['global/getIsLogged'] && redirect('/profile');
      break;
    case '/profile/registration':
      !store.getters['global/getIsLogged'] && redirect('/profile/login');
      store.getters['auth/user/getIsActual'] && redirect('/profile');
      break;
    case '/':
      if (typeof (document) !== 'undefined') {
        //  !store.getters['global/getIsLogged'] && store.commit('auth/setLogoutSuccess')
      }
      break;
    default:
      return store.getters['global/getIsLogged']
  }
}
