<template>
  <!-- 통계 카드 -->
  <DashboardStats :stats="stats" />

  <!-- 차트 전체 영역 -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
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
                class="px-1 py-0.5 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-1"
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
                class="px-1 py-0.5 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-1"
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
                class="px-1 py-0.5 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-1"
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
                class="px-1 py-0.5 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-1"
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
                class="px-1 py-0.5 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-1"
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
                class="px-1 py-0.5 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50 flex items-center gap-1"
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
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">배차 현황(일)</h2>
      <Doughnut_chart />
    </div>

    <!-- 지점별 예약 분포 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-8 h-[380px]">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">지점별 예약 분포</h2>
      <Half_doughnut />
    </div>
  </div>

  <!-- 하단 3개 영역 -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
    <!-- 보관소 상태 모니터링 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">보관소 상태 모니터링</h2>
      
      <!-- 지점 선택 버튼 -->
      <div class="flex gap-2 mb-4">
        <button
          v-for="branch in branches"
          :key="branch.id"
          @click="selectedBranch = branch.id"
          :class="[
            'px-3 py-1.5 text-sm rounded transition-colors',
            selectedBranch === branch.id
              ? 'bg-yellow-100 text-yellow-800 font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ branch.name }}
        </button>
      </div>

      <!-- 현재 선택된 지점 정보 -->
      <div class="space-y-3">
        <div class="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          <span>대구역 보관소</span>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-4">
          <div>- 실내 🟢 정상</div>
          <div>- 평균: 68% 사용 중</div>
          <div>- 온도: 4.2°C</div>
          <div>- 적정일: 2025.11.22 09:30</div>
        </div>
        <button class="text-sm text-gray-500 hover:text-gray-700 underline">
          [상세보기]
        </button>
      </div>
    </div>

    <!-- 고객 문의 관리 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">고객 문의 관리</h2>
        <div class="flex items-center gap-2">
          <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">미답변 5</span>
          <button 
            @click="goToInquiries"
            class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            전체보기
            <span>→</span>
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <div
          v-for="inquiry in inquiries"
          :key="inquiry.id"
          class="p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
        >
          <div class="text-sm font-medium text-gray-800 dark:text-white">
            {{ inquiry.title }}
          </div>
        </div>
      </div>
    </div>

    <!-- 공지사항 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">공지사항</h2>
        <button 
          @click="goToNotices"
          class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          전체보기
          <span>→</span>
        </button>
      </div>

      <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <div
          v-for="notice in notices"
          :key="notice.id"
          class="hover:text-gray-900 dark:hover:text-white cursor-pointer"
        >
          {{ notice.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BarChart from "@/components/BarChart.vue";
import Chart from "@/components/Chart.vue";
import DashboardStats from "@/components/DashboardStats.vue";
import Doughnut_chart from "@/components/Doughnut_chart.vue";
import Half_doughnut from "@/components/Half_doughnut.vue";

// 현재 날짜 기준으로 연도, 월, 주차 계산 함수
const getCurrentDateInfo = () => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString();

  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();

  const currentDate = now.getDate();
  const adjustedDate = currentDate + firstDayOfWeek;
  const week = Math.ceil(adjustedDate / 7).toString();

  return { year, month, week };
};

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

const toggleDropdown = (chart, type) => {
  if (chart === "reservation") {
    Object.keys(reservationDropdowns.value).forEach((key) => {
      if (key !== type) reservationDropdowns.value[key] = false;
    });
    reservationDropdowns.value[type] = !reservationDropdowns.value[type];
  } else if (chart === "sales") {
    Object.keys(salesDropdowns.value).forEach((key) => {
      if (key !== type) salesDropdowns.value[key] = false;
    });
    salesDropdowns.value[type] = !salesDropdowns.value[type];
  }
};

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

// 보관소 지점 데이터
const branches = [
  { id: 1, name: "동대구역" },
  { id: 2, name: "경대병원역" },
  { id: 3, name: "반월당역" },
  { id: 4, name: "서대구역" },
  { id: 5, name: "대구공항점" },
];

const selectedBranch = ref(1);

// 고객 문의 데이터
const inquiries = [
  { id: 1, title: "[픽업 문의] 다른 보관소에서 수령할 수 있나요?" },
  { id: 2, title: "[보관 문의] 빵 보관기간이 얼마나 되나요?" },
  { id: 3, title: "[배송 문의] 빵이 아닌 다른 보관소에 넘겨져 왔어요" },
  { id: 4, title: "[기타 문의] 주문 후 변경사항 전달이 가능한가요?" },
  { id: 5, title: "[결제 문의] 보관료결과는 증빙 결제할 것 같아요" },
];

// 공지사항 데이터
const notices = [
  { id: 1, content: "대구역 보관소 냉장설비 점기 안내입니다." },
  { id: 2, content: "배차 현황 실시간 새로고침 기능이 추가되었습니다." },
  { id: 3, content: "10월 25일(금) 02:00~04:00 시험 점검 예정" },
  { id: 4, content: "'인구 알림 자동 전송' 기능이 새로 추가되었습니다!" },
  { id: 5, content: "10월 1일부터 보관 수수료 변경이 일부 변경됩니다." },
  { id: 6, content: "신규 기사 교육 일정 안내" },
];

// 페이지 이동 함수
const goToInquiries = () => {
  // 고객 문의 전체보기 페이지로 이동
  console.log("고객 문의 전체보기");
  // router.push('/inquiries');
};

const goToNotices = () => {
  // 공지사항 전체보기 페이지로 이동
  console.log("공지사항 전체보기");
  // router.push('/notices');
};
</script>