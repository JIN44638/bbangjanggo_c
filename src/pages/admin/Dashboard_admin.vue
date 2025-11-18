<template>
  <!-- 통계 카드 -->
  <DashboardStats :stats="stats" />

  <!-- 차트 전체 영역 -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
    <!-- 예약 현황 차트 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-8">
      <!-- 헤더 영역: 제목 + 필터 + 보기 전환 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">예약 현황</h2>

          <!-- 필터 영역 -->
          <div class="flex items-center gap-1">
            <!-- 연도 선택 -->
            <div class="relative">
              <button
                @click="toggleDropdown('reservation', 'year')"
                class="px-1.5 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-1"
              >
                {{ reservationFilters.year }}년
                <span class="text-gray-400">▼</span>
              </button>
              <div
                v-if="reservationDropdowns.year"
                class="absolute top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[80px]"
              >
                <div
                  v-for="y in years"
                  :key="y"
                  @click="
                    reservationFilters.year = y;
                    reservationDropdowns.year = false;
                  "
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {{ y }}년
                </div>
              </div>
            </div>

            <!-- 월 선택 -->
            <div class="relative">
              <button
                @click="toggleDropdown('reservation', 'month')"
                class="px-1.5 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-1"
              >
                {{ reservationFilters.month }}월
                <span class="text-gray-400">▼</span>
              </button>
              <div
                v-if="reservationDropdowns.month"
                class="absolute top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[70px]"
              >
                <div
                  v-for="m in months"
                  :key="m"
                  @click="
                    reservationFilters.month = m;
                    reservationDropdowns.month = false;
                  "
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {{ m }}월
                </div>
              </div>
            </div>

            <!-- 주차 선택 -->
            <div v-if="reservationFilters.viewType === 'weekly'" class="relative">
              <button
                @click="toggleDropdown('reservation', 'week')"
                class="px-1.5 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-1"
              >
                {{ reservationFilters.week }}주차
                <span class="text-gray-400">▼</span>
              </button>
              <div
                v-if="reservationDropdowns.week"
                class="absolute top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[80px]"
              >
                <div
                  v-for="w in weeks"
                  :key="w"
                  @click="
                    reservationFilters.week = w;
                    reservationDropdowns.week = false;
                  "
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {{ w }}주차
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 보기 전환 버튼 -->
        <div class="flex border border-gray-300 rounded overflow-hidden text-xs">
          <button
            @click="reservationFilters.viewType = 'weekly'"
            :class="[
              'px-3 py-1 text-xs',
              reservationFilters.viewType === 'weekly'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50',
            ]"
          >
            주차별
          </button>
          <button
            @click="reservationFilters.viewType = 'monthly'"
            :class="[
              'px-3 py-1 text-xs border-l border-gray-300',
              reservationFilters.viewType === 'monthly'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50',
            ]"
          >
            월별
          </button>
        </div>
      </div>

      <!-- 차트 영역 -->
      <div class="h-64">
        <Chart
          :year="reservationFilters.year"
          :month="reservationFilters.month"
          :week="reservationFilters.week"
          :viewType="reservationFilters.viewType"
        />
      </div>
    </div>

    <!-- 매출현황 차트 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-8">
      <!-- 헤더 영역: 제목 + 필터 + 보기 전환 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">매출 현황</h2>

          <!-- 필터 영역 -->
          <div class="flex items-center gap-1">
            <!-- 연도 선택 -->
            <div class="relative">
              <button
                @click="toggleDropdown('sales', 'year')"
                class="px-1.5 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-1"
              >
                {{ salesFilters.year }}년
                <span class="text-gray-400">▼</span>
              </button>
              <div
                v-if="salesDropdowns.year"
                class="absolute top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[80px]"
              >
                <div
                  v-for="y in years"
                  :key="y"
                  @click="
                    salesFilters.year = y;
                    salesDropdowns.year = false;
                  "
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {{ y }}년
                </div>
              </div>
            </div>

            <!-- 월 선택 -->
            <div class="relative">
              <button
                @click="toggleDropdown('sales', 'month')"
                class="px-1.5 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-1"
              >
                {{ salesFilters.month }}월
                <span class="text-gray-400">▼</span>
              </button>
              <div
                v-if="salesDropdowns.month"
                class="absolute top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[70px]"
              >
                <div
                  v-for="m in months"
                  :key="m"
                  @click="
                    salesFilters.month = m;
                    salesDropdowns.month = false;
                  "
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {{ m }}월
                </div>
              </div>
            </div>

            <!-- 주차 선택 -->
            <div v-if="salesFilters.viewType === 'weekly'" class="relative">
              <button
                @click="toggleDropdown('sales', 'week')"
                class="px-1.5 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-1"
              >
                {{ salesFilters.week }}주차
                <span class="text-gray-400">▼</span>
              </button>
              <div
                v-if="salesDropdowns.week"
                class="absolute top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[80px]"
              >
                <div
                  v-for="w in weeks"
                  :key="w"
                  @click="
                    salesFilters.week = w;
                    salesDropdowns.week = false;
                  "
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {{ w }}주차
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 보기 전환 버튼 -->
        <div class="flex border border-gray-300 rounded overflow-hidden text-xs">
          <button
            @click="salesFilters.viewType = 'weekly'"
            :class="[
              'px-3 py-1 text-xs',
              salesFilters.viewType === 'weekly' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50',
            ]"
          >
            주차별
          </button>
          <button
            @click="salesFilters.viewType = 'monthly'"
            :class="[
              'px-3 py-1 text-xs border-l border-gray-300',
              salesFilters.viewType === 'monthly'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50',
            ]"
          >
            월별
          </button>
        </div>
      </div>

      <!-- 차트 영역 -->
      <div class="h-64">
        <BarChart
          :year="salesFilters.year"
          :month="salesFilters.month"
          :week="salesFilters.week"
          :viewType="salesFilters.viewType"
        />
      </div>
    </div>

    <!-- 배차현황 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-8 h-[380px]">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white">배차 현황(일)</h2>
      <Doughnut_chart />
    </div>

    <!-- 지점별 예약 분포 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-8 h-[380px]">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white ">지점별 예약 분포(빵장고 지점 기준)</h2>
      <Half_doughnut />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BarChart from "@/components/BarChart.vue";
import Chart from "@/components/Chart.vue";
import DashboardStats from "@/components/DashboardStats.vue";
import Doughnut_chart from "@/components/Doughnut_chart.vue";
import Half_doughnut from "@/components/Half_doughnut.vue";

// 현재 날짜 기준으로 연도, 월, 주차 계산 함수
const getCurrentDateInfo = () => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString(); // 0부터 시작하므로 +1

  // 해당 월의 첫날
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0(일) ~ 6(토)

  // 현재 날짜가 몇 주차인지 계산
  const currentDate = now.getDate();
  const adjustedDate = currentDate + firstDayOfWeek;
  const week = Math.ceil(adjustedDate / 7).toString();

  return { year, month, week };
};

// 예약 현황 필터 상태 (현재 날짜 기준으로 초기화)
const { year: currentYear, month: currentMonth, week: currentWeek } = getCurrentDateInfo();

const reservationFilters = ref({
  year: currentYear,
  month: currentMonth,
  week: currentWeek,
  viewType: "weekly",
});

const reservationDropdowns = ref({
  year: false,
  month: false,
  week: false,
});

// 매출 현황 필터 상태 (현재 날짜 기준으로 초기화)
const salesFilters = ref({
  year: currentYear,
  month: currentMonth,
  week: currentWeek,
  viewType: "weekly",
});

const salesDropdowns = ref({
  year: false,
  month: false,
  week: false,
});

const years = ["2025"];
const months = ["10", "11", "12"];
const weeks = ["1", "2", "3", "4", "5"];

// 드롭다운 토글 함수
const toggleDropdown = (chart, type) => {
  if (chart === "reservation") {
    // 다른 드롭다운 닫기
    Object.keys(reservationDropdowns.value).forEach((key) => {
      if (key !== type) reservationDropdowns.value[key] = false;
    });
    reservationDropdowns.value[type] = !reservationDropdowns.value[type];
  } else if (chart === "sales") {
    // 다른 드롭다운 닫기
    Object.keys(salesDropdowns.value).forEach((key) => {
      if (key !== type) salesDropdowns.value[key] = false;
    });
    salesDropdowns.value[type] = !salesDropdowns.value[type];
  }
};

// 통계 카드 데이터
const stats = [
  {
    title: "실시간 주문 수",
    value: "25건",
    icon: "/images/pjs/c-icon/orders.png",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
  {
    title: "일 매출",
    value: "958,000 원",
    icon: "/images/pjs/c-icon/dailysales.png",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
  {
    title: "일 예약수 / 월간 총 예약 수",
    value: "31 건 / 128 건",
    icon: "/images/pjs/c-icon/reservation.png",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
  {
    title: "일 방문자수",
    value: "85 명",
    icon: "/images/pjs/c-icon/visitors.png",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
];
</script>
