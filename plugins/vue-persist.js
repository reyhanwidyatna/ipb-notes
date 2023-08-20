import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'ipbnotes',
    paths: ['notes']
  })(store)
}