export default function ({ store }) {
  if(!store.getters['custom/getMod'].headline) {
    return store.dispatch('custom/loadMod')
  }
}
