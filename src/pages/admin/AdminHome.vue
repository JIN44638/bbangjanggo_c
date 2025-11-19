<template>
  <div>
    <!-- 아래 전체 영역(로고영역제외) -->
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <!-- Font Awesome CDN 추가 -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

      <!-- 사이드 바 (고정) -->
      <div class="w-64 min-w-64 h-screen bg-white dark:bg-gray-800 shadow-lg fixed left-0 top-0 flex flex-col">
        <div class="p-4 flex-col text-left pl-9 pt-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-end gap-2 mb-6">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white">빵장고</h1>
            <!-- 오늘 날짜 빵장고 옆 위치 -->
            <!-- <div class="text-xs text-gray-600">{{ currentDate }}</div> -->
          </div>
          <span class="text-xl font-bold text-gray-800 dark:text-white">김빵장</span><span>님</span>
          <p class="text-xs font-bold py-1">좋은 하루 보내세요!</p>
          <div class="text-xs text-gray-600">{{ currentDate }}</div>
        </div>

        <!-- 네비게이션 메뉴 -->
        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
          <router-link
            v-for="link in links"
            :key="link.path"
            class="flex items-center px-4 py-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :to="link.path"
            :class="{
              'font-bold text-[#BA8E5F] dark:text-indigo-300': isActive(link.path),
              'text-gray-500 dark:text-gray-400': !isActive(link.path),
            }"
          >
            <img :src="isActive(link.path) ? link.activeIcon : link.icon" class="mr-3 w-5 h-5" alt="" />
            {{ link.name }}
          </router-link>
        </nav>

        <!-- 로그아웃 버튼 -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="logout"
            class="w-full flex items-center justify-center px-4 py-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <img src="/images/pjs/c-icon/logoout.png" class="mr-3 w-5 h-5" />
            로그아웃
          </button>
        </div>
      </div>

      <!-- 오른쪽 내용 (사이드바 너비만큼 왼쪽 마진) -->
      <div class="flex-1 ml-64 min-h-screen ">
        <div class="w-full">
          <!-- 사고발생 경고창 배너 -->
          <AlertBanner />

          <!-- 메인 컨텐츠 -->
          <div class="p-3">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import AlertBanner from "@/components/AlertBanner.vue";

const route = useRoute();
const router = useRouter();

const links = [
  {
    name: "대시 보드",
    path: "/admin/dashboard",
    icon: "/images/pjs/c-icon/dashboard.png",
    activeIcon: "/images/pjs/c-icon/dashboard-active.png",
  },
  {
    name: "예약 관리",
    path: "/admin/reservation",
    icon: "/images/pjs/c-icon/reservation.png",
    activeIcon: "/images/pjs/c-icon/reservation-active.png",
  },
  {
    name: "기사 관리",
    path: "/admin/workermanage",
    icon: "/images/pjs/c-icon/delivery.png",
    activeIcon: "/images/pjs/c-icon/delivery-active.png",
  },
  {
    name: "정산관리",
    path: "/admin/payment",
    icon: "/images/pjs/c-icon/payment.png",
    activeIcon: "/images/pjs/c-icon/payment-active.png",
  },
  {
    name: "고객 문의 관리",
    path: "/admin/custormer",
    icon: "/images/pjs/c-icon/custormer.png",
    activeIcon: "/images/pjs/c-icon/custormer-active.png",
  },
  {
    name: "공지 및 알림",
    path: "/admin/notice",
    icon: "/images/pjs/c-icon/notice.png",
    activeIcon: "/images/pjs/c-icon/notice-active.png",
  },
  {
    name: "관리자 설정",
    path: "/admin/settings",
    icon: "/images/pjs/c-icon/setting.png",
    activeIcon: "/images/pjs/c-icon/setting-active.png",
  },
];

// 현재 날짜 표시
const currentDate = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = days[today.getDay()];

  return `${year}.${month}.${day}(${dayOfWeek})`;
});

// 현재 경로에 따른 활성화 상태
const isActive = (path) => route.path === path;

const logout = () => {
  router.push("/admin");
};
</script>

<style scoped>
/* @media (max-width: 768px) {
  .fixed {
    position: relative;
    width: 100%;
    height: auto;
  } */
/* .ml-64 {
    margin-left: 0;
  }
} */
</style>
