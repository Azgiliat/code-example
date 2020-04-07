<template>
<div class="user">
  <p class="user__info">
    Похоже, что вы ещё не зарегистрированы в нашем приложении. Создайте виртуальную бонусную карту, чтобы начать копить бонусы!
  </p>
  <nuxt-link class="user__new-card-button" to="profile/registration">
    Создать бонусную карту
  </nuxt-link>
</div>
</template>

<script>
export default {
  name: "NotActualUser",
  props: {
    user: {
      type: Object,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
.user__info {
  margin: 0 0 2rem;
}

.user__new-card-button {
  display: block;
  background-color: var(--contrastcolor);
  color: #ffffff;
  text-decoration: none;
  text-align: center;
  border-radius: 10px;
  padding: 10px;
  margin: 0 auto 2rem;
}
</style>
