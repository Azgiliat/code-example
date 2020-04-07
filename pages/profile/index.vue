<template>
<section class="cabinet">
  <h2 class="header cabinet__header">
    Личный кабинет
  </h2>
  <div class="container-center success" v-if="!networkError">
    <div class="cabinet__user user">
      <component :is="isActual ? 'ActualUser': 'NotActualUser'" :user="user" />
      <button class="user__logout-button" @click="onLogoutClick">
        Выйти
      </button>
    </div>
  </div>
  <div class="container-center error" v-else>
    {{networkError}}
  </div>
</section>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'
import ActualUser from '~/components/Cabinet/ActualUser.vue'
import NotActualUser from "../../components/Cabinet/NotActualUser.vue"

export default {
  name: 'LogIn',
  validate ({store}) {
    return store.getters['global/getOneModule']('cabinet')
  },
  components: {
    ActualUser,
    NotActualUser
  },
  middleware: ['check-auth'],
  computed: {
    ...mapGetters('auth/user', {
      user: 'getUser',
      userError: 'getUserError',
      networkError: 'getNetworkError',
      isActual: 'getIsActual'
    })
  },
  methods: {
    ...mapActions('auth/user', {
      loadUserInfo: 'loadUserInfo',
      logout: 'logout'
    }),
    ...mapMutations('global', {
      setIsLogged: 'setIsLogged'
    }),
    onLogoutClick () {
      this.logout();
      this.$router.push('/')
    }
  },
  watch: {
    userError (newValue) {
      if (newValue) {
        this.$router.push('/profile/login')
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.cabinet {
  padding-bottom: 50px;
}

.cabinet__header {
  margin-bottom: 1rem;
}

.cabinet__error {
  text-align: center;
}

.cabinet__error-text {
  margin: 0 0 20px;
}

.cabinet__error-content {
  display: block;
  margin: 0 0 20px;
}

.cabinet__repeat-login {
  display: block;
  border: none;
  background-color: var(--maincolor);
  color: var(--color-on-primary);
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 1rem;
  margin: 0 auto;
}

.user__logout-button {
  border: none;
  background-color: var(--maincolor);
  color: var(--color-on-primary);
  width: 100%;
  font-size: 1rem;
  padding-top: 10px;
  padding-bottom: 10px;

  @media(min-width: $desktop-width) {
    margin: 0 auto;
    max-width: 50%;
    display: block;
  }
}
</style>
