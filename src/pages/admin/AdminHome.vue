<template>
  <div>
    <!-- 전체 레이아웃 -->
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <!-- Font Awesome CDN -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

      <!-- 사이드바 -->
      <div class="w-64 min-w-64 h-screen bg-white dark:bg-gray-800 shadow-lg fixed left-0 top-0 flex flex-col">
        <!-- 상단 정보 -->
        <div class="p-4 flex-col text-left pl-9 pt-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-end gap-2 mb-6">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white">빵장고</h1>
          </div>
          <span class="text-xl font-bold text-gray-800 dark:text-white">김빵장</span><span>님</span>
          <p class="text-xs font-bold py-1">좋은 하루 보내세요!</p>
          <div class="text-xs text-gray-600">{{ currentDate }}</div>
        </div>

        <!-- 네비게이션 메뉴 -->
        <!-- 사이드바 네비게이션 메뉴 아래쪽에 배치 -->
        <div class="flex-1 p-4 overflow-y-auto flex flex-col justify-between">
          <!-- 기존 메뉴 -->
          <div class="space-y-2">
            <router-link
              v-for="link in links"
              :key="link.path"
              class="flex items-center px-4 py-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              :to="link.path"
              :class="{
                'font-bold text-[#BA8E5F] bg-[#BA8E5F]/20 dark:text-indigo-300': isActive(link.path),
                'text-gray-400 dark:text-gray-500': !isActive(link.path),
              }"
            >
              <i
                :class="link.icon"
                class="mr-3 w-5 text-center"
                :style="{ color: isActive(link.path) ? '#BA8E5F' : '' }"
              ></i>
              {{ link.name }}
            </router-link>
          </div>
        </div>

        <!-- 로그아웃 버튼 -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="logout"
            class="w-full flex items-center justify-center px-4 py-2 text-gray-400 dark:text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <i class="fa-solid fa-right-from-bracket mr-3 w-5"></i>
            로그아웃
          </button>
        </div>
      </div>

      <!-- 오른쪽 메인 영역 -->
      <div class="flex-1 ml-64 min-h-screen">
        <div class="w-full">
          <!-- 기존 상단 sticky 영역 내부 -->
          <div class="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900 px-1 border-b-gray-100 border-b-5">
            <div class="flex bg-white dark:bg-gray-800 rounded-lg mx-3 px-8 shadow-xs">
              <!-- 사고발생 경고창 배너 (80% 너비) -->
              <div class="flex-1">
                <AlertBanner />
              </div>

              <!-- 긴급 처리 사항 (20% 너비) -->
              <div class="w-1/8 bg-white flex flex-col justify-center">
                <div class="flex items-center justify-evenly gap-1">
                  <div class="flex items-center gap-2">
                    <i
                      :class="[
                        'fa-solid fa-triangle-exclamation',
                        totalUncheckedCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500',
                      ]"
                    ></i>
                    <span
                      :class="
                        totalUncheckedCount > 0
                          ? 'text-red-600 dark:text-red-400 font-bold'
                          : 'text-gray-400 dark:text-gray-500 font-bold'
                      "
                      class="whitespace-nowrap"
                    >
                      긴급 처리 사항
                    </span>
                  </div>

                  <span
                    :class="
                      totalUncheckedCount > 0
                        ? 'text-red-600 text-opacity-80 dark:text-red-400 font-bold text-shadow'
                        : 'text-gray-400 dark:text-gray-500 font-bold text-shadow'
                    "
                    class="whitespace-nowrap"
                  >
                    {{ totalUncheckedCount }}건
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 메인 컨텐츠 -->
          <div class="flex-1 px-4 pt-2 pb-3">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>

    <!-- 긴급 처리 모달 -->
    <EmergencyModal v-model:visible="showEmergencyModal" :alerts="alerts" @allChecked="handleAllChecked" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AlertBanner from "@/components/AlertBanner.vue";
import EmergencyModal from "@/components/EmergencyModal.vue";

const route = useRoute();
const router = useRouter();

const links = [
  { name: "대시 보드", path: "/admin/dashboard", icon: "fa-solid fa-house" },
  { name: "예약 관리", path: "/admin/reservation", icon: "fa-solid fa-calendar-check" },
  { name: "기사 관리", path: "/admin/workermanage", icon: "fa-solid fa-truck" },
  { name: "매출 현황", path: "/admin/payment", icon: "fa-solid fa-cash-register" },
  { name: "고객 문의 관리", path: "/admin/custormer", icon: "fa-solid fa-comment-dots" },
  { name: "공지 및 알림", path: "/admin/notice", icon: "fa-solid fa-bell" },
  { name: "관리자 설정", path: "/admin/settings", icon: "fa-solid fa-gear" },
];

// 현재 날짜
const currentDate = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = days[today.getDay()];
  return `${year}.${month}.${day}(${dayOfWeek})`;
});

// 활성 메뉴
const isActive = (path) => route.path === path;

// 로그아웃
const logout = () => router.push("/loginworker");

// 긴급 처리 사항
const alerts = ref([
  { id: 1, category: "장비 장애", text: "반월당역점 14번 냉장고 고장", count: 1, checked: false },
  { id: 2, category: "장비 장애", text: "경대병원역점 9번 냉장고 온도 상승", count: 1, checked: false },
  { id: 3, category: "픽업 지연", text: "픽업 시간 초과 3건", count: 3, checked: false },
  { id: 4, category: "결제 오류", text: "결제 미완료 예약 2건", count: 2, checked: false },
  { id: 5, category: "고객센터", text: "문의 답변 대기 5건", count: 5, checked: false },
]);

const uncheckedAlerts = computed(() => alerts.value.filter((a) => !a.checked));
const modalVisible = ref(false);
const showEmergencyModal = ref(false);
// const openEmergencyModal = () => {
//   modalVisible.value = true;
// };
// 미확인 알림의 총 개수
const totalUncheckedCount = computed(() => alerts.value.filter((a) => !a.checked).length);

// 대시보드 경로인지 확인하는 computed 속성
const isDashboard = computed(() => route.path === "/admin/dashboard");
// 대시보드일 때만 모달 띄우기
onMounted(() => {
  if (isDashboard.value && uncheckedAlerts.value.length > 0) {
    showEmergencyModal.value = true;
  }
});
// 모달 닫기 및 처리
const handleAllChecked = () => {
  alerts.value.forEach((a) => (a.checked = true));
  showEmergencyModal.value = false; // 모달을 닫음
};

// 팝업 페이지마다 띄우기
// onMounted(() => {
//   if (uncheckedAlerts.value.length > 0) {
//     showEmergencyModal.value = true;
//   }
// });
// const handleAllChecked = () => {
//   alerts.value.forEach((a) => (a.checked = true));
// };
</script>

<style scoped>
/* 아이콘 통일 */
i {
  font-size: 1.125rem;
  width: 1.25rem;
}
/* 텍스트 그림자 추가 */
.text-shadow {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
