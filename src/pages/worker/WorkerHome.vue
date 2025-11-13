<template>
  <div class="w-[768px] m-auto bg-red-100 overflow-hidden">
    <!-- Font Awesome CDN 추가 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <router-view></router-view>
    <!-- 하단 메뉴바 -->
    <nav
      class="fixed inset-x-0 bottom-0 flex items-center justify-between bg-white w-[768px] h-[60px] m-auto p-4 shadow-[0px_-1px_5px_rgba(0,0,0,0.05)]"
    >
      <router-link
        :to="link.path"
        v-for="link in links"
        :key="link.path"
        class="flex flex-col items-center justify-center gap-1 text-[#969696] transition-colors"
        :class="{ 'text-[#50311D]': isActive(link.path) }"
      >
        <i :class="[link.icon, 'text-2xl']"></i>
        <span class="text-xs font-[SpokaHanSansNeo] leading-none">{{ link.name }}</span>
      </router-link>
      <!-- 서브메뉴 -->
      <div
        class="flex flex-col items-center justify-center gap-1 text-[#969696] hover:text-[#50311D] transition-colors"
      >
        <i class="fa-solid fa-bars text-2xl"></i>
        <span class="text-[10px] font-[SpokaHanSansNeo] leading-none">메뉴</span>
      </div>
    </nav>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const links = [
  { name: "홈", path: "/worker/dashboard", icon: "fa-solid fa-house" },
  {
    name: "알림",
    path: "/worker/notice",
    icon: "fa-solid fa-bell",
  },
  { name: "오늘의 업무", path: "/worker/jobs", icon: "fa-solid fa-truck" },
  { name: "마이페이지", path: "/worker/mypage", icon: "fa-solid fa-user" },
];
// 현재 경로에 따른 활성화 상태
const isActive = (path) => route.path === path;
</script>
