<template>
  <div class="w-[768px] m-auto h-screen flex flex-col relative">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

    <!-- router-view 영역 -->
    <div class="flex-1 overflow-hidden relative">
      <router-view></router-view>

      <!-- 오버레이 (메뉴 열릴 때만 보임) -->
      <div
        v-if="isSubMenuOpen"
        class="absolute inset-0 bg-black/40 transition-opacity duration-300"
        @click="closeSubMenu"
      ></div>

      <!-- 서브메뉴 슬라이드 패널 -->
      <div
        class="z-[999] absolute top-0 right-0 h-full bg-white shadow-lg transition-transform duration-300"
        :class="isSubMenuOpen ? 'translate-x-0' : 'translate-x-full'"
        style="width: 60%"
      >
        <!-- 서브메뉴 컨텐츠 -->
        <div class="relative p-6 space-y-6">
          <button
            @click="closeSubMenu"
            class="absolute right-[30px] text-[25px] cursor-pointer text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <i class="fas fa-times"></i>
          </button>
          <div class="pt-1">
            <!-- <h2 class="text-xl font-bold text-[#50311D] font-[SpokaHanSansNeo] mb-4">메뉴</h2> -->
            <ul class="space-y-4 font-[SpokaHanSansNeo]">
              <li class="text-lg text-[#50311D] cursor-pointer">오늘의 수입</li>
              <li class="text-lg text-[#50311D] cursor-pointer">정산 내역</li>
              <li class="text-lg text-[#50311D] cursor-pointer">보험 관리</li>
              <li class="text-lg text-[#50311D] cursor-pointer">배달 기록</li>
              <li class="text-lg text-[#50311D] cursor-pointer">운행 시간</li>
              <li class="text-lg text-[#50311D] cursor-pointer">이벤트 및 공지사항</li>
              <li class="text-lg text-[#50311D] cursor-pointer">문의하기</li>
            </ul>
          </div>
        </div>
      </div>
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

      <!-- 서브메뉴 버튼 -->
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
const activeMenu = ref(route.path);

const links = [
  { name: "홈", path: "/worker/dashboard", icon: "fa-solid fa-house" },
  { name: "알림", path: "/worker/notice", icon: "fa-solid fa-bell" },
  { name: "오늘의 업무", path: "/worker/jobs", icon: "fa-solid fa-truck" },
  { name: "마이페이지", path: "/worker/mypage", icon: "fa-solid fa-user" },
];

const activateMenu = (path) => {
  activeMenu.value = path;
  isSubMenuOpen.value = false;
};

const toggleSubMenu = () => {
  isSubMenuOpen.value = !isSubMenuOpen.value;

  if (isSubMenuOpen.value) activeMenu.value = null;
};

const closeSubMenu = () => {
  isSubMenuOpen.value = false;
};

const goMenu = (path) => {
  isSubMenuOpen.value = false;
  router.push(path);
};

watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath;
    isSubMenuOpen.value = false;
  }
);
</script>
