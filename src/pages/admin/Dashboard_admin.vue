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
    <Monitoring />
    <!-- 고객 문의 관리 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs p-6">
      <div class="flex justify-between items-center mb-3">
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">고객 문의 관리</h2>
          <div class="border border-[#E67E50] rounded-xl px-3 py-1 flex items-center text-center gap-1 cursor-pointer">
            <span class="text-[#E67E50] font-bold text-xs">미답변</span>
            <span class="text-[#E67E50] font-black text-xm"> 5</span>
          </div>
        </div>
        <button @click="goToInquiries" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer">
          전체보기
          <span><i class="fa-solid fa-angles-right" style="color: #adafb3"></i></span>
        </button>
      </div>

      <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300 px-3">
        <div
          v-for="inquiry in inquiries"
          :key="inquiry.id"
          class="p-2 border-b border-gray-200 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
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
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">공지사항</h2>
          <div class="border border-[#E67E50] rounded-xl px-3 py-1 flex items-center text-center gap-1 cursor-pointer">
            <span class="text-[#E67E50] font-bold text-xs">NEW</span>
            <span class="text-[#E67E50] font-black text-xm"> 2</span>
          </div>
        </div>
        <button @click="goToNotices" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer">
          전체보기
          <span><i class="fa-solid fa-angles-right" style="color: #adafb3"></i></span>
        </button>
      </div>

      <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300 px-3">
        <div
          v-for="notice in notices"
          :key="notice.id"
          class="p-2 border-b border-gray-200 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
        >
          {{ notice.content }}
        </div>
      </div>
    </div>
  </div>
 
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BarChart from "@/components/BarChart.vue";
import Chart from "@/components/Chart.vue";
import DashboardStats from "@/components/DashboardStats.vue";
import Doughnut_chart from "@/components/Doughnut_chart.vue";
import Half_doughnut from "@/components/Half_doughnut.vue";
import Monitoring from "@/components/Monitoring.vue";
import EmergencyModal from "@/components/EmergencyModal.vue";
import { useRouter } from "vue-router";

const router = useRouter();

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
    icon: "fa-solid fa-clock ",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
  {
    title: "일 매출",
    value: "958,000 원",
    icon: "fa-solid fa-coins",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
  {
    title: "일 예약수 / 월간 총 예약 수",
    value: "31 건 / 128 건",
    icon: "fa-solid fa-calendar-check",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
  {
    title: "일 방문자수",
    value: "85 명",
    icon: "fa-solid fa-user-group",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
];

// 고객 문의 데이터
const inquiries = [
  { id: 1, title: "[픽업 문의] 다른 보관소에서 수령할 수 있나요?" },
  { id: 2, title: "[보관 문의] 빵 보관기간이 얼마나 되나요?" },
  { id: 3, title: "[배송 문의] 다른 지점으로 변경하고 싶어요" },
  { id: 4, title: "[기타 문의] 주문 완료 후 예약변경이 가능한가요?" },
  { id: 5, title: "[결제 문의] 보관료 후불 결제 되나요?" },
];

// 공지사항 데이터
const notices = [
  { id: 1, content: "대구역 보관소 냉장설비 점검 안내입니다." },
  { id: 2, content: "배차 현황 실시간 새로고침 기능이 추가되었습니다." },
  { id: 3, content: "10월 25일(금) 02:00~04:00 시스템 점검 예정" },
  { id: 4, content: "'인구 알림 자동 전송' 기능이 새로 추가되었습니다!" },
  { id: 5, content: "10월 1일부터 보관 수수료가 일부 변경됩니다." },
  // { id: 6, content: "신규 기사 교육 일정 안내" },
];

// 페이지 이동 함수
const goToInquiries = () => {
  router.push("/admin/custormer");
};

const goToNotices = () => {
  router.push("/admin/notice");
};
// 팝업
const showEmergencyModal = ref(false);

// 예: 대시보드 로딩 시 자동 팝업
onMounted(() => {
  showEmergencyModal.value = true;
});

// 혹은 버튼 클릭으로 열기
const openEmergencyModal = () => {
  showEmergencyModal.value = true;
};
const props = defineProps({
  visible: Boolean,
  alerts: Array,
});

const emit = defineEmits(["update:visible"]);
// 기존 branchStatus 데이터 사용
const branchStatus = {
  1: {
    name: "동대구역점",
    status: "정상",
    statusColor: "green",
    breadCount: 34,
    totalCapacity: 50,
    temperature: "4.2°C",
    humidity: "45%",
    checkedAt: "2025.12.12 09:30",
  },
  2: {
    name: "경대병원역점",
    status: "주의",
    statusColor: "yellow",
    breadCount: 41,
    totalCapacity: 50,
    temperature: "5.1°C",
    humidity: "52%",
    checkedAt: "2025.12.11 15:10",
  },
  3: {
    name: "반월당역점",
    status: "점검 필요",
    statusColor: "red",
    breadCount: 46,
    totalCapacity: 50,
    temperature: "6.0°C",
    humidity: "58%",
    checkedAt: "2025.12.11 11:40",
  },
  4: {
    name: "서대구역점",
    status: "정상",
    statusColor: "green",
    breadCount: 23,
    totalCapacity: 50,
    temperature: "3.8°C",
    humidity: "43%",
    checkedAt: "2025.12.12 09:20",
  },
  5: {
    name: "대구공항점",
    status: "정상",
    statusColor: "green",
    breadCount: 29,
    totalCapacity: 50,
    temperature: "4.0°C",
    humidity: "47%",
    checkedAt: "2025.12.12 10:00",
  },
};
// 팝업영역

// 긴급 점검 지점 필터링
const emergencyBranches = computed(() => Object.values(branchStatus).filter((b) => b.statusColor === "red"));
// 대시보드 진입 시 팝업 표시
onMounted(() => {
  if (emergencyBranches.value.length > 0) {
    showEmergencyModal.value = true;
  }
});
// 팝업 닫기
const closeEmergencyModal = () => {
  showEmergencyModal.value = false;
};
// 긴급 알림 항목
const emergencyAlerts = ref([
  { text: "냉장보관소 14번 냉장고 고장으로 작동 불가", checked: false },
  { text: "결제 오류", checked: false },
  { text: "문의 답변 대기 5건", checked: false },
  { text: "중요 승인 대기 3건", checked: false },
]);
// 확인하지 않은 항목 필터링
const uncheckedAlerts = computed(() => emergencyAlerts.value.filter((a) => !a.checked));

onMounted(() => {
  if (emergencyAlerts.value.length > 0) {
    showEmergencyModal.value = true;
  }
});
// 모니터링 페이지 이동
// const goToMonitoring = () => {
//   showEmergencyModal.value = false;
//   router.push("/admin/monitoring");
// };
</script>
<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
