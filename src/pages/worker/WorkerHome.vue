<template>
  <div class="w-[768px] m-auto h-screen flex flex-col overflow-hidden">
    <!-- h-screen과 flex flex-col 추가, overflow-hidden으로 변경 -->
    <!-- Font Awesome CDN 추가 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    
    <!-- router-view 영역을 스크롤 가능하게 -->
    <div class="flex-1 overflow-y-auto">
      <router-view></router-view>
    </div>
    
    <!-- 하단 메뉴바 -->
    <nav
      class="z-[9999] flex items-center justify-between bg-white w-full h-[60px] py-4 px-[35px] shadow-[0px_-1px_5px_rgba(0,0,0,0.05)]"
    >
      <router-link
        :to="link.path"
        v-for="link in links"
        :key="link.path"
        class="flex flex-col items-center justify-center gap-1 transition-colors"
        @click="activateMenu(link.path)"
      >
        <i :class="[link.icon, 'text-2xl', activeMenu === link.path ? 'text-[#50311D]' : 'text-[#969696]']"></i>
        <span
          class="text-xs font-[SpokaHanSansNeo] leading-none"
          :class="activeMenu === link.path ? 'text-[#50311D]' : 'text-gray-400'"
        >
          {{ link.name }}
        </span>
      </router-link>
      <!-- 서브메뉴 -->
      <button
        @click="toggleSubMenu"
        class="flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
        :class="isSubMenuOpen ? 'text-[#50311D]' : 'text-gray-400'"
      >
        <i class="fa-solid fa-bars text-2xl"></i>
        <span class="text-xs font-[SpokaHanSansNeo] leading-none">메뉴</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// 서브메뉴 토글 상태
const isSubMenuOpen = ref(false);
// 현재 활성화된 메뉴
const activeMenu = ref(route.path);

const links = [
  { name: "홈", path: "/worker/dashboard", icon: "fa-solid fa-house" },
  { name: "알림", path: "/worker/notice", icon: "fa-solid fa-bell" },
  { name: "오늘의 업무", path: "/worker/jobs", icon: "fa-solid fa-truck" },
  { name: "마이페이지", path: "/worker/mypage", icon: "fa-solid fa-user" },
];

// 메뉴 활성화 함수
const activateMenu = (path) => {
  activeMenu.value = path;
  isSubMenuOpen.value = false;
};

// 서브메뉴 토글 함수
const toggleSubMenu = () => {
  isSubMenuOpen.value = !isSubMenuOpen.value;
  // 서브메뉴를 열면 다른 메뉴들 비활성화
  if (isSubMenuOpen.value) {
    activeMenu.value = null;
  }
};

// route가 변경될 때 activeMenu 업데이트
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath;
    isSubMenuOpen.value = false;
  }
);
</script>