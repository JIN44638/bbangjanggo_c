
<template>
  <div class="w-full max-w-[728px] mx-auto">
    <!-- 월 선택 헤더 -->
    <div class="w-full max-w-[280px] sm:max-w-[320px] mx-auto my-6 sm:my-8 mb-4 sm:mb-5">
      <!-- 페이지네이션 -->
      <div class="flex items-center justify-between px-2">
        <button
          @click="prevMonth"
          class="bg-transparent border-none cursor-pointer transition-transform hover:scale-110 active:scale-95 p-1 text-base sm:text-lg text-[#BA8E5F]"
        >
          <i class="fa-solid fa-caret-left"></i>
        </button>
        <span class="text-[#111] text-base sm:text-[18px] font-medium font-[Pretendard]">
          {{ currentYear }}년 {{ currentMonth }}월
        </span>
        <button
          @click="nextMonth"
          class="bg-transparent border-none cursor-pointer transition-transform hover:scale-110 active:scale-95 p-1 text-base sm:text-lg text-[#BA8E5F]"
        >
          <i class="fa-solid fa-caret-right"></i>
        </button>
      </div>
    </div>

    <!-- 요일 헤더 -->
    <div class="grid grid-cols-7 bg-white text-center text-xs sm:text-sm font-medium">
      <div class="py-2 sm:py-3 text-[#ff4b0f]">일</div>
      <div class="py-2 sm:py-3 text-[#505050]">월</div>
      <div class="py-2 sm:py-3 text-[#505050]">화</div>
      <div class="py-2 sm:py-3 text-[#505050]">수</div>
      <div class="py-2 sm:py-3 text-[#505050]">목</div>
      <div class="py-2 sm:py-3 text-[#505050]">금</div>
      <div class="py-2 sm:py-3 text-[#4299e1]">토</div>
    </div>

    <!-- 캘린더 그리드 -->
    <div class="grid grid-cols-7 border border-[#d9d9d9] rounded-[10px] overflow-hidden">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="h-17 bg-white relative cursor-pointer transition-colors"
        :class="{
          'border-r border-[#d9d9d9]': (index + 1) % 7 !== 0,
          'border-b border-[#d9d9d9]': index < calendarDays.length - 7,
          'bg-[#fff3e0] hover:bg-[#ffe0b2]': day.isToday,
          'hover:bg-[#f9fafb]': !day.isToday && !day.isSelected,
        }"
        @click="selectDate(day)"
      >
        <!-- 날짜 표시 -->
        <span
          class="absolute top-0.5 sm:top-1 right-1 sm:right-2 text-xs sm:text-[14px] transition-all"
          :class="{
            'text-[#d9d9d9]': !day.isCurrentMonth,
            'text-[#ff4b0f]': day.isCurrentMonth && index % 7 === 0 && !day.isToday && !day.isSelected,
            'text-[#4299e1]': day.isCurrentMonth && index % 7 === 6 && !day.isToday && !day.isSelected,
            'text-[#767676]':
              day.isCurrentMonth && index % 7 !== 0 && index % 7 !== 6 && !day.isToday && !day.isSelected,
            'font-bold !text-white bg-[#ff6f00] rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center !right-[4px] sm:!right-[6px] !top-[2px]':
              day.isToday && !day.isSelected,
            'font-bold !text-white bg-[#BA8E5F] rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center !right-0.5 sm:!right-1':
              day.isSelected,
          }"
        >
          {{ day.date }}
        </span>

        <!-- 수입 금액 표시 (날짜 아래 작게) -->
        <div
          v-if="day.workData && day.isCurrentMonth"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-[11px] sm:text-[14px] font-medium"
          :class="day.isSelected ? 'text-[#BA8E5F]' : 'text-[#767676]'"
        >
          {{ formatIncome(day.workData.totalIncome) }}
        </div>
      </div>
    </div>

    <!-- 선택된 날짜 상세 정보 카드 -->
    <transition name="fade">
      <div v-if="selectedDateInfo" class="w-full bg-white border border-gray-200 rounded-xl mt-4 sm:mt-6 shadow-md">
        <div class="p-4 sm:p-6 border-b border-[#FFEBC2]">
          <!-- 날짜 표시 -->
          <div class="text-xs sm:text-sm text-gray-500 font-[SpokaHanSansNeo] mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-100">
            {{ formatDateDisplay(selectedDateInfo.fullDate) }}
          </div>

          <!-- 주요 정보 3개 -->
          <div class="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div class="text-center">
              <p class="text-[10px] sm:text-xs text-gray-500 font-[SpokaHanSansNeo] mb-1 sm:mb-2">총 근무 시간</p>
              <p class="text-base sm:text-lg font-bold font-[Cafe24Surround] text-gray-800">{{ selectedDateInfo.workHours }}</p>
            </div>
            <div class="text-center">
              <p class="text-[10px] sm:text-xs text-gray-500 font-[SpokaHanSansNeo] mb-1 sm:mb-2">총 배송 건수</p>
              <p class="text-base sm:text-lg font-bold font-[Cafe24Surround] text-gray-800">
                {{ selectedDateInfo.deliveryCount }}건
              </p>
            </div>
            <div class="text-center">
              <p class="text-[10px] sm:text-xs text-gray-500 font-[SpokaHanSansNeo] mb-1 sm:mb-2">기본 수입</p>
              <p class="text-base sm:text-lg font-bold font-[Cafe24Surround] text-gray-800">
                {{ formatMoney(selectedDateInfo.baseIncome) }}
              </p>
            </div>
          </div>

          <!-- 인센티브 세부 항목 -->
          <div class="space-y-1.5 sm:space-y-2">
            <div class="flex justify-between items-center text-xs sm:text-sm">
              <span class="text-gray-600 font-[SpokaHanSansNeo]">빠른 응답 인센티브</span>
              <span class="text-gray-800 font-medium font-[SpokaHanSansNeo]">{{
                formatMoney(selectedDateInfo.quickResponseBonus)
              }}</span>
            </div>
            <div class="flex justify-between items-center text-xs sm:text-sm">
              <span class="text-gray-600 font-[SpokaHanSansNeo]">근무지역 외 배송 수당</span>
              <span class="text-gray-800 font-medium font-[SpokaHanSansNeo]">{{
                formatMoney(selectedDateInfo.longDistanceBonus)
              }}</span>
            </div>
            <div class="flex justify-between items-center text-xs sm:text-sm">
              <span class="text-gray-600 font-[SpokaHanSansNeo]">우천 배송 수당</span>
              <span class="text-gray-800 font-medium font-[SpokaHanSansNeo]">{{
                formatMoney(selectedDateInfo.weatherBonus)
              }}</span>
            </div>
            <div class="flex justify-between items-center text-xs sm:text-sm">
              <span class="text-gray-600 font-[SpokaHanSansNeo]">피크타임 수당</span>
              <span class="text-gray-800 font-medium font-[SpokaHanSansNeo]">{{
                formatMoney(selectedDateInfo.peakTimeBonus)
              }}</span>
            </div>
          </div>
        </div>

        <!-- 총 수입 -->
        <div class="bg-[#FFFBF2] rounded-lg p-3 sm:p-4 px-4 sm:px-6">
          <div class="flex justify-between items-center">
            <span class="text-sm sm:text-base font-semibold font-[SpokaHanSansNeo] text-gray-700">총 수입</span>
            <span class="text-xl sm:text-2xl font-bold font-[Cafe24Surround] text-[#50311D]">{{
              formatMoney(selectedDateInfo.totalIncome)
            }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// JSON 파일 import
import calendarData from "@/data/calendar_worker.json";

export default {
  name: "CalendarComponent",
  data() {
    const today = new Date();
    return {
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth() + 1,
      today: {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        date: today.getDate(),
      },
      selectedDate: null,

      // import한 데이터 사용
      schedules: calendarData.schedules,
      workData: calendarData.workData,
    };
  },
  computed: {
    calendarDays() {
      const year = this.currentYear;
      const month = this.currentMonth;

      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      const startDay = firstDay.getDay();
      const prevMonthLastDay = new Date(year, month - 1, 0).getDate();

      const days = [];

      // 이전 달 날짜들
      for (let i = startDay - 1; i >= 0; i--) {
        days.push({
          date: prevMonthLastDay - i,
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          fullDate: `${year}-${month - 1}-${prevMonthLastDay - i}`,
        });
      }

      // 현재 달 날짜들
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const dateKey = `${year}-${month}-${i}`;
        const isToday = this.today.year === year && this.today.month === month && this.today.date === i;
        const isSelected = this.selectedDate === dateKey;

        days.push({
          date: i,
          isCurrentMonth: true,
          isToday: isToday,
          isSelected: isSelected,
          fullDate: dateKey,
          schedule: this.schedules[dateKey] || null,
          workData: this.workData[dateKey] || null,
        });
      }

      // 다음 달 날짜들
      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: i,
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          fullDate: `${year}-${month + 1}-${i}`,
        });
      }

      return days;
    },
    selectedDateInfo() {
      if (!this.selectedDate) return null;
      const data = this.workData[this.selectedDate];
      if (!data) return null;

      return {
        fullDate: this.selectedDate,
        ...data,
      };
    },
  },
  methods: {
    // 월 변경될 때 금액 합계 계산하기
    calculateMonthlyIncome() {
      const year = this.currentYear;
      const month = this.currentMonth;

      const filteredData = Object.keys(this.workData)
        .filter((date) => date.startsWith(`${year}-${month}-`))
        .map((date) => this.workData[date].totalIncome);

      const total = filteredData.reduce((sum, v) => sum + v, 0);

      this.$emit("update-income", total);
    },

    prevMonth() {
      if (this.currentMonth === 1) {
        this.currentMonth = 12;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.selectedDate = null;
      this.calculateMonthlyIncome();
    },

    nextMonth() {
      if (this.currentMonth === 12) {
        this.currentMonth = 1;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.selectedDate = null;
      this.calculateMonthlyIncome();
    },
    selectDate(day) {
      if (!day.isCurrentMonth) return;
      if (!day.workData) return;

      // 토글: 같은 날짜 클릭 시 선택 해제
      if (this.selectedDate === day.fullDate) {
        this.selectedDate = null;
      } else {
        this.selectedDate = day.fullDate;
        this.$emit("date-selected", day.fullDate, day.schedule);
      }
    },
    formatMoney(amount) {
      return amount.toLocaleString() + "원";
    },
    formatIncome(amount) {
      if (amount >= 10000) {
        const man = Math.floor(amount);
        const rest = amount % 10000;
        if (rest === 0) {
          return man + "만";
        }
        return man.toLocaleString();
      }
    },
    formatDateDisplay(dateStr) {
      const [year, month, day] = dateStr.split("-");
      return `${year}년 ${month}월 ${day}일`;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
