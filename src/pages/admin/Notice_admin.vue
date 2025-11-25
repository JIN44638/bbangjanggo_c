<template>
  <div class="space-y-6 text-gray-800 dark:bg-gray-900 dark:text-gray-200">

    <!-- 공지사항 박스 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">

      <!-- 제목 + 검색 + 필터 -->
      <div
        class="p-4 border-b border-gray-200 dark:border-gray-700 
        flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <h2 class="text-lg font-semibold">공지사항</h2>

        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

          <!-- 검색 -->
          <div class="relative sm:w-64">
            <input
              v-model="searchQuery"
              @input="handleInput"
              type="text"
              placeholder="제목 또는 작성자로 검색"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <i class="fas fa-search absolute left-3 top-3 text-gray-400 dark:text-gray-500"></i>
          </div>

          <!-- 필터 -->
          <select
            v-model="statusFilter"
            class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="all">전체</option>
            <option value="title">제목</option>
            <option value="author">작성자</option>
            <option value="date">작성일</option>
          </select>
        </div>
      </div>

      <!-- 테이블 영역 -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">번호</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">제목</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">작성자</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">작성일</th>
            </tr>
          </thead>

          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="notice in paginatedNotices"
              :key="notice.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{{ notice.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ notice.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ notice.author }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ notice.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 (➡ 내부 + 중앙 정렬) -->
      <div
        class="p-4 flex flex-col sm:flex-row justify-center items-center gap-4 
               border-t border-gray-200 dark:border-gray-700"
      >
        <!-- <div class="text-sm">
          총 <span class="font-medium">{{ filteredNotices.length }}</span>건
        </div> -->

        <div class="flex gap-2">
          <button @click="prevPage" :disabled="currentPage === 1"
            class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">
            <i class="fas fa-chevron-left"></i>
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 border rounded',
              currentPage === page
                ? 'bg-[#BA8E5F] text-white'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>

          <button @click="nextPage" :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const statusFilter = ref("all");

function handleInput(e) {
  searchQuery.value = e.target.value;
}

const notices = ref([
  { id: 1, title: "대구역 보관소 냉장설비 정기 점검 안내드립니다.", author: "박정은", date: "2025-12-15 " },
  { id: 2, title: "배차 현황 실시간 새로고침 기능이 추가되었습니다.", author: "김민승", date: "2025-12-15" },
  { id: 3, title: "10월 25일(금) 02:00~04:00 서버 점검 예정", author: "박진성", date: "2025-12-15" },
  { id: 4, title: "‘입고 알림 자동 전송’ 기능이 새로 추가되었습니다!", author: "김명진", date: "2025-12-15" },
  { id: 5, title: "10월 1일부터 보관 수수료 정책이 일부 변경됩니다.", author: "김민승", date: "2025-12-14" },
  { id: 6, title: "신규 기사 교육 일정 안내", author: "박진성", date: "2025-12-14" },
  { id: 7, title: "대구역 냉장보관소 정기 점검 소식", author: "박정은", date: "2025-12-14" },
  { id: 8, title: "대구역 냉장보관소 정기 점검 안내", author: "김민승", date: "2025-12-14" },
  { id: 9, title: "냉장설비 점검 안내 대구역 보관소", author: "김명진", date: "2025-12-14" },
  { id: 10, title: "대구역 보관소 냉장설비 정기 점검 안내", author: "박진성", date: "2025-12-13" },
     { id: 11, title: "대구역 보관소 냉장설비 정기 점검 안내드립니다.", author: "박정은", date: "2025-12-13" },
        { id: 12, title: "배차 현황 실시간 새로고침 기능이 추가되었습니다.", author: "김민승", date: "2025-12-13" },
        { id: 13, title: "10월 25일(금) 02:00~04:00 서버 점검 예정", author: "박진성", date: "2025-12-12" },
        { id: 14, title: "‘입고 알림 자동 전송’ 기능이 새로 추가되었습니다!", author: "김명진", date: "2025-12-12" },
        { id: 15, title: "10월 1일부터 보관 수수료 정책이 일부 변경됩니다.", author: "김민승", date: "2025-12-12" },
         { id: 16, title: "신규 기사 교육 일정 안내", author: "박진성", date: "2025-12-12" },
        { id: 17, title: "대구역 냉장보관소 정기 점검 소식", author: "박정은", date: "2025-12-12" },
        { id: 18, title: "대구역 냉장보관소 정기 점검 안내", author: "김민승", date: "2025-12-12" },
        { id: 19, title: "냉장설비 점검 안내 대구역 보관소", author: "김명진", date: "2025-12-12" },
        { id: 20, title: "대구역 보관소 냉장설비 정기 점검 안내", author: "박진성", date: "2025-12-12" },

]);

/* ---------------------- 필터 ---------------------- */
const filteredNotices = computed(() => {
  let result = [...notices.value];
  const query = searchQuery.value.toLowerCase();

  if (query) {
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query)
    );
  }

  return result;
});

/* ---------------------- 페이지네이션 ---------------------- */
const currentPage = ref(1);
const itemsPerPage = 12;

const totalPages = computed(() =>
  Math.ceil(filteredNotices.value.length / itemsPerPage)
);

const paginatedNotices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredNotices.value.slice(start, start + itemsPerPage);
});

const goToPage = (n) => (currentPage.value = n);
const nextPage = () =>
  currentPage.value < totalPages.value && currentPage.value++;
const prevPage = () =>
  currentPage.value > 1 && currentPage.value--;
</script>
