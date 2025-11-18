<template>
  <!-- 메인페이지 -->
  <div class="wrap" v-if="!isSpecialPage">
    <Header />
    <main>
      <RouterView></RouterView>
      <Quick />
    </main>
    <Footer v-if="!route.meta.hideFooter" />
  </div>

    <!-- 관리자, 기사페이지 -->
  <div v-else>
    <router-view></router-view>
  </div>

</template>
<script setup>
import { useRoute } from "vue-router";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import Quick from "./components/Quick.vue";
import { computed } from "vue";

const route = useRoute()

// 관리자 기사 페이지 레이아웃
const isSpecialPage = computed(() => {
  return route.path.startsWith("/admin") || route.path.startsWith("/worker") || route.path.startsWith("/loginworker") || route.path.startsWith("/signupworker") || route.path.startsWith("/register");
});
</script>

<style lang="scss" scoped></style>
