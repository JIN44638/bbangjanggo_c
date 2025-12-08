<template>
  <div class="w-full max-w-[768px] h-full m-auto p-4 sm:p-[30px] overflow-y-scroll">
    <h3 class="font-[Cafe24Surround] text-2xl sm:text-[28px] text-center text-[#50311D] mb-6 sm:mb-[30px]">알림</h3>

    <!-- 탭 -->
    <div class="w-full rounded-lg border border-[#50311D] mb-4 sm:mb-5">
      <div class="flex justify-between text-center relative z-10">
        <!-- 소식 탭 -->
        <p
          class="rounded-l-sm font-[SpokaHanSansNeo] text-sm sm:text-4 w-[50%] leading-9 sm:leading-[40px] cursor-pointer transition-colors duration-300"
          :class="activeTab === 'news' ? 'bg-[#50311D] text-white' : 'text-[#50311D]'"
          @click="activeTab = 'news'"
        >
          소식
        </p>

        <!-- 알림 탭 -->
        <p
          class="rounded-r-sm font-[SpokaHanSansNeo] text-sm sm:text-4 w-[50%] leading-9 sm:leading-[40px] cursor-pointer transition-colors duration-300"
          :class="activeTab === 'alert' ? 'bg-[#50311D] text-white' : 'text-[#50311D]'"
          @click="activeTab = 'alert'"
        >
          알림
        </p>
      </div>
    </div>

    <!-- 소식 목록 -->
    <div v-if="activeTab === 'news'">
      <div v-for="(n, i) in noticeList" :key="i" class="py-4 sm:py-5 border-t border-gray-200 last:border-b">
        <div class="cursor-pointer flex items-center">
          <span class="text-sm sm:text-4 font-[SpokaHanSansNeo] flex-shrink-0" :class="getLabelColor(n.label)">{{ n.label }}</span>
          <p class="px-2 sm:px-3 text-sm sm:text-4 font-[SpokaHanSansNeo]">
            {{ n.message }}
          </p>
        </div>
        <span class="font-[SpokaHanSansNeo] text-gray-400 text-[11px] sm:text-[12px]">{{ n.date }}</span>
      </div>
    </div>

    <!-- 알림 (내용 없음) -->
    <div v-else class="w-full h-[500px] sm:h-[690px] flex flex-col justify-center items-center">
      <i class="text-2xl sm:text-[30px] text-gray-300 fa-solid fa-bell"></i>
      <p class="text-gray-300 font-[SpokaHanSansNeo] text-sm sm:text-base py-2">새로운 알림이 없습니다.</p>
    </div>
  </div>
</template>
<script setup>
import notices from "@/data/notice.json";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// 처음 페이지 진입 시 기본 탭 = 소식
const activeTab = ref("news");

// 소식 목록
const noticeList = ref(notices);

const getLabelColor = (label) => {
  if (label.includes("긴급")) return "text-red-600";
  if (label.includes("NEW") || label.includes("new")) return "text-sky-500";
  return "text-black";
};

// route.query 변화 감지
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab === 'alert') {
      activeTab.value = 'alert';
    } else if (newTab === 'news') {
      activeTab.value = 'news';
    }
    // newTab이 없으면 현재 상태 유지
  },
  { immediate: true } // 즉시 실행으로 초기값도 처리
);

// onMounted(() => {
//   const isRefresh =
//     performance.navigation?.type === 1 || performance.getEntriesByType?.("navigation")[0]?.type === "reload";

//   if (isRefresh) {
//     activeTab.value = "news";
//     router.replace({ path: "/worker/notice", query: {} });
//   } else {
//     if (route.query.tab === "alert") {
//       activeTab.value = "alert";
//     }
//   }
// });
</script>
