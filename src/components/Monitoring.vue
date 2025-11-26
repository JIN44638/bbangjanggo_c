<template>
  <!-- 보관소 상태 모니터링 -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-6">
    <div class="flex items-center gap-2 mb-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white">보관소 상태 모니터링</h2>
      <div class="border border-[#E67E50] rounded-xl px-3 py-1 flex items-center text-center gap-1 cursor-pointer">
        <span class="text-[#E67E50] font-bold text-xs">점검필요</span>
        <span class="text-[#E67E50] font-black text-xm"> 2</span>
      </div>
    </div>
    <!-- 지점 선택 버튼 -->
    <div class="flex justify-center gap-1 my-10">
      <button
        v-for="branch in branches"
        :key="branch.id"
        @click="selectedBranch = branch.id"
        :class="[
          'px-[15px] py-1.5 text-sm rounded transition-colors whitespace-nowrap cursor-pointer',
          selectedBranch === branch.id
            ? 'bg-[#BA8E5F] border-2 border-[#BA8E5F] text-[#ffffff] font-bold'
            : 'border border-gray-300 text-gray-500 hover:bg-gray-100',
        ]"
      >
        {{ branch.name }}
      </button>
    </div>

    <!-- 상태 정보 전체를 감싸는 div에 flex와 justify-center 추가 -->
    <div class="flex justify-center">
      <!-- 현재 선택된 지점 정보 -->
      <div class="space-y-4">
        <!-- 상태 정보 -->
        <div class="flex gap-4.5 space-y-3 text-sm">
          <div >
            <!-- 상태 -->
            <div class="flex items-center pb-5">
              <div class="flex items-center gap-3 w-33">
                <i class="fa-solid fa-circle-check w-5 text-center text-gray-500"></i>
                <span class="text-gray-500 font-bold dark:text-gray-400 flex-shrink-0">상태</span>
              </div>
              <span class="font-semibold" :class="getStatusTextColor(branchStatus[selectedBranch].statusColor)">
                {{ branchStatus[selectedBranch].status }}
              </span>
            </div>

            <!-- 보관 빵 개수 -->
            <div class="flex items-center pb-5">
              <div class="flex items-center gap-3 w-33">
                <i class="fa-solid fa-bread-slice w-5 text-center text-gray-500"></i>
                <span class="text-gray-500 font-bold dark:text-gray-400 flex-shrink-0">현재 보관중</span>
              </div>
              <span class="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {{ branchStatus[selectedBranch].breadCount }}개 / {{ branchStatus[selectedBranch].totalCapacity }}개
              </span>
            </div>

            <!-- 온도 -->
            <div class="flex items-center pb-5">
              <div class="flex items-center gap-3 w-33">
                <i class="fa-solid fa-temperature-half w-5 text-center text-gray-500"></i>
                <span class="text-gray-500 font-bold dark:text-gray-400 flex-shrink-0">온도</span>
              </div>
              <span class="font-medium text-gray-700 dark:text-gray-300">
                {{ branchStatus[selectedBranch].temperature }}
              </span>
            </div>
          </div>
          <!-- 세로 구분선 추가 -->
          <div class="w-px bg-gray-300/50 "></div>
          <div>
            <!-- 습도 -->
            <div class="flex items-center pb-5">
              <div class="flex items-center gap-3 w-33">
                <i class="fa-solid fa-droplet w-5 text-center text-gray-500"></i>
                <span class="text-gray-500 font-bold dark:text-gray-400 flex-shrink-0">습도</span>
              </div>
              <span class="font-medium text-gray-700 dark:text-gray-300">
                {{ branchStatus[selectedBranch].humidity }}
              </span>
            </div>

            <!-- 금일 입출고 수량 -->
            <div class="flex items-center pb-5">
              <div class="flex items-center gap-3 w-33">
                <i class="fa-solid fa-arrow-right-arrow-left w-5 text-center text-gray-500"></i>
                <span class="text-gray-500 font-bold dark:text-gray-400 flex-shrink-0 whitespace-nowrap"
                  >금일 입출고</span
                >
              </div>
              <span class="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                입고 {{ branchStatus[selectedBranch].inCount }} / 출고 {{ branchStatus[selectedBranch].outCount }}
              </span>
            </div>

            <!-- 점검일 -->
            <div class="flex items-center pb-5">
              <div class="flex items-center gap-3 w-33">
                <i class="fa-solid fa-calendar-check w-5 text-center text-gray-500"></i>
                <span class="text-gray-500 font-bold dark:text-gray-400 flex-shrink-0">점검일</span>
              </div>
              <span class="font-medium text-gray-700 dark:text-gray-300">
                {{ branchStatus[selectedBranch].checkedAt }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 보관소 지점 데이터
const branches = [
  { id: 1, name: "동대구역" },
  { id: 2, name: "경대병원역" },
  { id: 3, name: "반월당역" },
  { id: 4, name: "서대구역" },
  { id: 5, name: "대구공항점" },
];

const selectedBranch = ref(1);
const branchStatus = {
  1: {
    name: "동대구역점",
    status: "정상",
    statusColor: "green",
    capacity: "68% 사용 중",
    breadCount: "34",
    totalCapacity: "50",
    temperature: "4.2°C",
    humidity: "45%",
    inCount: "12",
    outCount: "8",
    checkedAt: "2025.12.12 09:30",
  },
  2: {
    name: "경대병원역점",
    status: "주의",
    statusColor: "yellow",
    capacity: "82% 사용 중",
    breadCount: "41",
    totalCapacity: "50",
    temperature: "5.1°C",
    humidity: "52%",
    inCount: "18",
    outCount: "5",
    checkedAt: "2025.12.11 15:10",
  },
  3: {
    name: "반월당역점",
    status: "점검 필요",
    statusColor: "red",
    capacity: "92% 사용 중",
    breadCount: "46",
    totalCapacity: "50",
    temperature: "6.0°C",
    humidity: "58%",
    inCount: "22",
    outCount: "3",
    checkedAt: "2025.12.11 11:40",
  },
  4: {
    name: "서대구역점",
    status: "정상",
    statusColor: "green",
    capacity: "45% 사용 중",
    breadCount: "23",
    totalCapacity: "50",
    temperature: "3.8°C",
    humidity: "43%",
    inCount: "9",
    outCount: "11",
    checkedAt: "2025.12.12 09:20",
  },
  5: {
    name: "대구공항점점",
    status: "정상",
    statusColor: "green",
    capacity: "58% 사용 중",
    breadCount: "29",
    totalCapacity: "50",
    temperature: "4.0°C",
    humidity: "47%",
    inCount: "14",
    outCount: "7",
    checkedAt: "2025.12.12 10:00",
  },
};

// 색상 관련 함수들
const getStatusBorderColor = (color) => {
  return {
    green: "border-green-500",
    yellow: "border-yellow-500",
    red: "border-red-500",
  }[color];
};

const getStatusIconColor = (color) => {
  return {
    green: "text-green-500",
    yellow: "text-yellow-500",
    red: "text-red-500",
  }[color];
};

const getStatusTextColor = (color) => {
  return {
    green: "text-green-600 dark:text-green-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    red: "text-red-600 dark:text-red-400",
  }[color];
};
</script>
