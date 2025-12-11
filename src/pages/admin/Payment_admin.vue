<template>
  <div class="space-y-3">
    <!-- 통합 통계 카드 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 min-w-246">
      <div
        v-for="stat in combinedStats"
        :key="stat.title"
        class="flex items-center justify-between gap-10 bg-white dark:bg-gray-800 rounded-lg shadow-xs px-6 py-4"
      >
        <!-- 타이틀 -->
        <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {{ stat.title }}
        </div>

        <!-- 월별/주별 데이터와 아이콘 -->
        <div class="flex items-center justify-between gap-10">
          <div class="flex flex-col gap-2">
            <!-- 월별 데이터 -->
            <div class="flex items-center justify-between w-45 backdrop:*: border-b border-gray-300 pb-1">
              <div class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 whitespace-nowrap">월</div>
              <div class="text-xl font-bold text-gray-900 dark:text-white">{{ stat.monthValue }}</div>
            </div>

            <!-- 주별 데이터 -->
            <div class="flex items-center justify-between w-45">
              <div class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 whitespace-nowrap">
                최근 1주일
              </div>
              <div class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ stat.weekValue }}</div>
            </div>
          </div>

          <!-- 아이콘 -->
          <div :class="['w-12 h-12 rounded-full flex items-center justify-center', stat.bgColor]">
            <i :class="stat.icon" class="text-xl text-gray-400 dark:text-gray-500"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 필터영역 -->
    <div class="grid grid-cols-2 gap-3 items-start">
      <!-- 일자별 매출 요약 필터 및 테이블 -->
      <div
        class="bg-white h-[639px] dark:bg-gray-800 rounded-lg shadow-xs px-7 pt-8  text-sm flex flex-col gap-4"
        style="min-height: calc(100vh - 280px)"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">이번달 일자별 매출</h2>
          <select
            v-model="selectedMonth"
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">전체기간</option>
            <option v-for="month in uniqueMonths" :key="month" :value="month">
              {{ formatMonthLabel(month) }}
            </option>
          </select>
        </div>
        <!-- 일자별 매출 요약 테이블 -->
        <div ref="dailyTableContainer" class="flex-1 overflow-y-auto min-h-0" :class="{ 'pb-4': !hasDailyScroll }">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead class="sticky top-0 bg-gray-50 dark:bg-gray-700">
              <tr class="border-t border-gray-200">
                <th class="px-3 py-2 pl-4 text-center text-sm font-medium text-gray-500 dark:text-gray-300">일자</th>
                <th class="px-3 py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-300">예약 건수</th>
                <th class="px-3 py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-300">취소 건수</th>
                <th class="px-3 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-300">취소 금액</th>
                <th class="px-3 py-2 pr-14 text-right text-sm font-medium text-gray-500 dark:text-gray-300">
                  최종 매출
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="date in sortedDailySummary" :key="date.reservationDate">
                <td class="px-3 py-2 pl-4 text-center">{{ date.reservationDate }}</td>
                <td class="px-3 py-2 text-center">{{ date.totalReservations }}</td>
                <td class="px-3 py-2 text-center">{{ date.cancelledCount }}</td>
                <td class="px-3 py-2 text-right pr-6">{{ formatCurrency(date.cancelledAmount) }}</td>
                <td class="px-3 py-2 pr-14 text-right">{{ formatCurrency(date.finalRevenue) }}</td>
              </tr>
              <!-- 합계 -->
              <tr class="bg-gray-50 dark:bg-gray-700 font-bold border-t border-gray-300">
                <td class="px-3 py-2 pl-4 text-center">합계</td>
                <td class="px-3 py-2 text-center">{{ dailySummaryTotal.totalReservations }}</td>
                <td class="px-3 py-2 text-center">{{ dailySummaryTotal.cancelledCount }}</td>
                <td class="px-3 py-2 text-right pr-6">{{ formatCurrency(dailySummaryTotal.cancelledAmount) }}</td>
                <td class="px-3 py-2 pr-14 text-right">{{ formatCurrency(dailySummaryTotal.finalRevenue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 기사별 정산 필터 및 테이블 -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xs px-7 pt-8 pb-8 text-sm flex flex-col gap-4"
        style="min-height: calc(100vh - 280px)"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">이번달 기사별 정산</h2>
          <div class="flex items-center gap-2">
            <input
              :value="driverSearchQuery"
              @input="handleSearchInput"
              type="text"
              placeholder="기사명으로 검색"
              class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              v-model="amountSortOrder"
              class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="highest">금액 높은순</option>
              <option value="lowest">금액 낮은순</option>
            </select>
            <select
              v-model="selectedMonthForDriver"
              class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">전체기간</option>
              <option v-for="month in uniqueMonths" :key="month" :value="month">
                {{ formatMonthLabel(month) }}
              </option>
            </select>
          </div>
        </div>
        <!-- 기사별 정산 테이블 -->
        <div ref="driverTableContainer" class="flex-1 overflow-y-auto min-h-0" :class="{ 'pb-4': !hasDriverScroll }">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead class="sticky top-0 bg-gray-50 dark:bg-gray-700">
              <tr class="border-t border-gray-200">
                <th class="px-3 py-2 pl-4 pr-10 text-center text-sm font-medium text-gray-500 dark:text-gray-300">
                  기사명
                </th>
                <th class="px-3 py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-300">배차 건수</th>
                <th class="px-3 pl-1 pr-20 text-right text-sm font-medium text-gray-500 dark:text-gray-300">
                  정산 금액
                </th>
                <th class="px-3 py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-300">정산 상태</th>
              </tr>
            </thead>

            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <!-- 기사 리스트 -->

              <template v-for="driver in sortedDriverSummary" :key="driver.name">
                <!-- 기사 요약행 -->
                <tr @click="toggleDriver(driver.name)" class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-3 py-2 pl-4 pr-10 text-center">{{ driver.name }}</td>
                  <td class="px-3 py-2 text-center">{{ driver.completedCount }}</td>
                  <td class="px-3 pl-1 text-right pr-22">
                    {{ formatCurrency(driver.totalRevenue) }}
                  </td>
                  <td class="px-3 py-2 text-center">
                    <span
                      class="px-2 py-1 text-xs rounded font-medium"
                      :class="{
                        'bg-green-100 text-green-700': driver.settlementStatus === '정산완료',
                        'bg-yellow-100 text-yellow-700': driver.settlementStatus === '정산예정',
                        'bg-red-100 text-red-600': driver.settlementStatus === '정산보류',
                      }"
                    >
                      {{ driver.settlementStatus }}
                    </span>
                  </td>
                </tr>

                <!-- 날짜별 상세 행 (펼침 상태일 때만 표시) -->
                <tr v-if="expandedDriver === driver.name">
                  <td colspan="4" class="bg-white dark:bg-gray-700 px-0 py-0">
                    <div class="w-[60%] ml-10">
                      <table class="min-w-full text-xs">
                        <thead>
                          <tr class="border-b border-gray-300">
                            <th class="px-2 py-1 text-left">날짜</th>
                            <th class="px-2 py-1 text-center">배차 건수</th>
                            <th class="px-2 py-1 text-right">매출</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="rec in driverRecordsByMonth(driver.original)"
                            :key="rec.date"
                            class="border-b border-gray-200 dark:border-gray-600"
                          >
                            <td class="px-2 py-1">{{ rec.date }}</td>
                            <td class="px-2 py-1 text-center">{{ rec.completedCount }}</td>
                            <td class="px-2 py-1 text-right">{{ formatCurrency(rec.revenue) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </template>

              <!-- 합계 -->
              <tr class="font-semibold bg-gray-50 dark:bg-gray-700 border-t">
                <td class="px-3 py-2 pl-4 pr-10 text-center">합계</td>
                <td class="px-3 py-2 text-center">{{ totalDriverCompleted }}</td>
                <td class="px-3 pl-1 text-right pr-22">{{ formatCurrency(totalDriverRevenue) }}</td>
                <td class="px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import paymentData from "@/data/payment_admin.json";

// JSON 데이터에서 예약 정보 추출 (stockCompleted 포함)
const reservations = computed(() =>
  paymentData.dailySales.map((day) => ({
    reservationDate: day.date,
    totalReservations: day.reserveCount,
    cancelledCount: day.cancelCount,
    cancelledAmount: day.cancelAmount,
    finalRevenue: day.totalSales,
    stockCompleted: day.stockCompleted || 0, // stockCompleted가 없으면 0 처리
  }))
);

// 12/5 ~ 12/12 매출 계산
const recentWeeklyRevenue = computed(() => {
  const startDate = "2025-12-05";
  const endDate = "2025-12-12";

  return reservations.value
    .filter((r) => r.reservationDate >= startDate && r.reservationDate <= endDate)
    .reduce((sum, r) => sum + r.finalRevenue, 0);
});

// 12/5 ~ 12/12 예약 건수 계산
const recentWeeklyReservations = computed(() => {
  const startDate = "2025-12-05";
  const endDate = "2025-12-12";

  return reservations.value
    .filter((r) => r.reservationDate >= startDate && r.reservationDate <= endDate)
    .reduce((sum, r) => sum + r.totalReservations, 0);
});

// 12/5 ~ 12/12 취소 건수 계산
const recentWeeklyCancelled = computed(() => {
  const startDate = "2025-12-05";
  const endDate = "2025-12-12";

  return reservations.value
    .filter((r) => r.reservationDate >= startDate && r.reservationDate <= endDate)
    .reduce((sum, r) => sum + r.cancelledCount, 0);
});

// 12/5 ~ 12/12 입고 완료 건수
const recentWeeklyInStock = computed(() => {
  const startDate = "2025-12-05";
  const endDate = "2025-12-12";

  return reservations.value
    .filter((r) => r.reservationDate >= startDate && r.reservationDate <= endDate)
    .reduce((sum, r) => sum + r.stockCompleted, 0);
});

// 금액 포맷 함수
const formatCurrency = (amount) => {
  return amount.toLocaleString("ko-KR", { style: "currency", currency: "KRW" });
};

// 통합 통계 데이터 (월별 + 주별)
const combinedStats = computed(() => {
  const totalReservations = reservations.value.reduce((sum, r) => sum + r.totalReservations, 0);
  const cancelled = reservations.value.reduce((sum, r) => sum + r.cancelledCount, 0);
  const inStock = reservations.value.reduce((sum, r) => sum + r.stockCompleted, 0);
  const totalRevenue = reservations.value.reduce((sum, r) => sum + r.finalRevenue, 0);

  return [
    {
      title: "예약 건수",
      monthValue: `${totalReservations}건`,
      weekValue: `${recentWeeklyReservations.value}건`,
      icon: "fas fa-calendar",
      bgColor: "bg-gray-100 dark:bg-gray-700",
    },
    {
      title: "취소 건수",
      monthValue: `${cancelled}건`,
      weekValue: `${recentWeeklyCancelled.value}건`,
      icon: "fas fa-times",
      bgColor: "bg-gray-100 dark:bg-gray-700",
    },
    {
      title: "입고 완료",
      monthValue: `${inStock}건`,
      weekValue: `${recentWeeklyInStock.value}건`,
      icon: "fas fa-check",
      bgColor: "bg-gray-100 dark:bg-gray-700",
    },
    {
      title: "총매출",
      monthValue: formatCurrency(totalRevenue),
      weekValue: formatCurrency(recentWeeklyRevenue.value),
      icon: "fas fa-dollar-sign",
      bgColor: "bg-gray-100 dark:bg-gray-700",
    },
  ];
});

// 기사별 정산 데이터
const driverSales = computed(() => paymentData.driverSales);

// 월별 정산 금액 계산
const selectedMonthForDriver = ref("2025-12");

// 전체 기사 합계 (배차 + 금액)
const totalDriverCompleted = computed(() =>
  sortedDriverSummary.value.reduce((sum, driver) => sum + driver.completedCount, 0)
);

const totalDriverRevenue = computed(() =>
  sortedDriverSummary.value.reduce((sum, driver) => sum + driver.totalRevenue, 0)
);

// 정렬된 기사 리스트
const driverSearchQuery = ref("");
const driverSearchQueryDebounced = ref("");
const amountSortOrder = ref("highest");

// debounce를 위한 타이머
let searchTimer = null;

// 검색어 변경 감지
const handleSearchInput = (event) => {
  driverSearchQuery.value = event.target.value;

  // 이전 타이머 취소
  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  // 300ms 후에 실제 검색 실행
  searchTimer = setTimeout(() => {
    driverSearchQueryDebounced.value = driverSearchQuery.value;
  }, 300);
};

const sortedDriverSummary = computed(() => {
  const filteredDrivers = driverSales.value.filter((driver) =>
    driver.driver.toLowerCase().includes(driverSearchQueryDebounced.value.toLowerCase())
  );

  return filteredDrivers
    .map((driver) => {
      const monthPrefix = selectedMonthForDriver.value || null;
      const filteredRecords = monthPrefix
        ? driver.records.filter((r) => r.date.startsWith(monthPrefix))
        : driver.records;

      const completedCount = filteredRecords.reduce((sum, r) => sum + r.completedCount, 0);
      const totalRevenue = filteredRecords.reduce((sum, r) => sum + r.revenue, 0);

      return {
        name: driver.driver,
        completedCount,
        totalRevenue,
        settlementStatus: driver.settlementStatus,
        original: driver, // 날짜별 상세 표시용으로 원본 전달
      };
    })
    .sort((a, b) =>
      amountSortOrder.value === "highest" ? b.totalRevenue - a.totalRevenue : a.totalRevenue - b.totalRevenue
    );
});

// 월 필터
const selectedMonth = ref("2025-12");
const uniqueMonths = computed(() => {
  const months = reservations.value.map((r) => r.reservationDate.slice(0, 7));
  return [...new Set(months)];
});

// 일자별 매출
const dailySummary = computed(() => reservations.value);

// 일자별 필터
const selectedDate = ref("");
const filteredDailySummary = computed(() =>
  !selectedMonth.value
    ? dailySummary.value
    : dailySummary.value.filter((d) => d.reservationDate.startsWith(selectedMonth.value))
);

// 일자별 정렬
const dateSortOrder = ref("latest");
const sortedDailySummary = computed(() => {
  const sorted = [...filteredDailySummary.value];
  return sorted.sort((a, b) =>
    dateSortOrder.value === "latest"
      ? new Date(b.reservationDate) - new Date(a.reservationDate)
      : new Date(a.reservationDate) - new Date(b.reservationDate)
  );
});

// 일자별 합계
const dailySummaryTotal = computed(() => {
  return filteredDailySummary.value.reduce(
    (acc, cur) => {
      acc.totalReservations += cur.totalReservations;
      acc.cancelledCount += cur.cancelledCount;
      acc.cancelledAmount += cur.cancelledAmount;
      acc.finalRevenue += cur.finalRevenue;
      acc.stockCompleted += cur.stockCompleted || 0;
      return acc;
    },
    { totalReservations: 0, cancelledCount: 0, cancelledAmount: 0, finalRevenue: 0, stockCompleted: 0 }
  );
});

const formatMonthLabel = (month) => {
  const [year, mm] = month.split("-");
  return `${year}년 ${mm}월`;
};

// 펼침 상태 추가
const expandedDriver = ref(null);
// 기사행 토글
const toggleDriver = (name) => {
  expandedDriver.value = expandedDriver.value === name ? null : name;
};
// 기사별 상세
const driverRecordsByMonth = (driver) => {
  const month = selectedMonthForDriver.value;

  if (!month) return driver.records; // 전체 기간

  return driver.records.filter((r) => r.date.startsWith(month));
};

// 데이터 변경 시 스크롤 상태 업데이트
watch([sortedDailySummary, selectedMonth], () => {
  updateScrollStates();
});

watch([sortedDriverSummary, expandedDriver, selectedMonthForDriver], () => {
  updateScrollStates();
});

// 컴포넌트 마운트 시 스크롤 상태 확인
onMounted(() => {
  updateScrollStates();
  // ResizeObserver를 사용하여 크기 변경 감지
  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(() => {
      updateScrollStates();
    });
    if (dailyTableContainer.value) {
      resizeObserver.observe(dailyTableContainer.value);
    }
    if (driverTableContainer.value) {
      resizeObserver.observe(driverTableContainer.value);
    }
  }
});
// refs
const dailyTableContainer = ref(null);
const driverTableContainer = ref(null);

const hasDailyScroll = ref(false);
const hasDriverScroll = ref(false);

// 초기 로드 시 두 영역 높이 맞추기
const setInitialEqualHeight = () => {
  nextTick(() => {
    if (!dailyTableContainer.value || !driverTableContainer.value) return;

    // 두 영역의 실제 높이 계산
    const dailyHeight = dailyTableContainer.value.clientHeight;
    const driverHeight = driverTableContainer.value.clientHeight;

    const maxHeight = Math.max(dailyHeight, driverHeight);

    // 초기 높이 설정
    dailyTableContainer.value.style.height = `${maxHeight}px`;
    driverTableContainer.value.style.height = `${maxHeight}px`;
  });
};

// 스크롤 상태 확인
const checkScroll = (container, hasScrollRef) => {
  if (!container) return;
  nextTick(() => {
    hasScrollRef.value = container.scrollHeight > container.clientHeight;
  });
};

// 데이터 변경 시 스크롤 상태 업데이트
const updateScrollStates = () => {
  checkScroll(dailyTableContainer.value, hasDailyScroll);
  checkScroll(driverTableContainer.value, hasDriverScroll);
};

// ------------------
// 초기 마운트
onMounted(() => {
  // 1. 초기 높이 맞춤
  setInitialEqualHeight();

  // 2. 스크롤 상태 확인
  updateScrollStates();

  // 3. ResizeObserver로 높이 변경 감지
  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(() => {
      // 초기 높이 맞춤 이후에는 각 영역 독립적으로 동작하도록 초기 높이 제거
      if (dailyTableContainer.value && driverTableContainer.value) {
        dailyTableContainer.value.style.height = "";
        driverTableContainer.value.style.height = "";
      }
      updateScrollStates();
    });

    if (dailyTableContainer.value) resizeObserver.observe(dailyTableContainer.value);
    if (driverTableContainer.value) resizeObserver.observe(driverTableContainer.value);
  }
});
</script>
<style scoped>
/* 왼쪽 영역은 고정 높이를 설정 (최소 높이 설정) */
.left-section {
  min-height: 500px; /* 원하는 최소 높이 설정 */
  height: 100%; /* 100% 높이를 채우되, 내용에 맞게 늘어나지 않음 */
}

/* 오른쪽 영역은 스크롤 가능 */
.right-section {
  overflow-y: auto; /* 스크롤이 가능하도록 설정 */
  height: 100%; /* 오른쪽 영역의 높이는 부모 높이에 맞춰 확장 */
}

</style>