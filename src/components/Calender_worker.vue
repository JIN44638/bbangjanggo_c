<template>
  <div class="w-full max-w-[728px] mx-auto">
    <!-- 월 선택 헤더 -->
    <div class="w-full max-w-[320px] mx-auto my-8 mb-5">
      <!-- 페이지네이션 -->
      <div class="flex items-center justify-between px-2">
        <button
          @click="prevMonth"
          class="bg-transparent border-none cursor-pointer transition-transform hover:scale-110 active:scale-95 p-1 text-lg text-[#BA8E5F]"
        >
          <i class="fa-solid fa-caret-left"></i>
        </button>
        <span class="text-[#111] text-[18px] font-medium font-[Pretendard]">
          {{ currentYear }}년 {{ currentMonth }}월
        </span>
        <button
          @click="nextMonth"
          class="bg-transparent border-none cursor-pointer transition-transform hover:scale-110 active:scale-95 p-1 text-lg text-[#BA8E5F]"
        >
          <i class="fa-solid fa-caret-right"></i>
        </button>
      </div>
    </div>

    <!-- 요일 헤더 -->
    <div class="grid grid-cols-7 bg-white text-center text-sm font-medium">
      <div class="py-3 text-[#ff4b0f]">일</div>
      <div class="py-3 text-[#505050]">월</div>
      <div class="py-3 text-[#505050]">화</div>
      <div class="py-3 text-[#505050]">수</div>
      <div class="py-3 text-[#505050]">목</div>
      <div class="py-3 text-[#505050]">금</div>
      <div class="py-3 text-[#4299e1]">토</div>
    </div>

    <!-- 캘린더 그리드 -->
    <div class="grid grid-cols-7 border border-[#d9d9d9] rounded-[10px] overflow-hidden">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="h-24 bg-white relative cursor-pointer transition-colors"
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
          class="absolute top-1 right-2 text-[14px] transition-all"
          :class="{
            'text-[#d9d9d9]': !day.isCurrentMonth,
            'text-[#ff4b0f]': day.isCurrentMonth && index % 7 === 0 && !day.isToday && !day.isSelected,
            'text-[#4299e1]': day.isCurrentMonth && index % 7 === 6 && !day.isToday && !day.isSelected,
            'text-[#767676]':
              day.isCurrentMonth && index % 7 !== 0 && index % 7 !== 6 && !day.isToday && !day.isSelected,
            'font-bold !text-white bg-[#ff6f00] rounded-full w-5 h-5 flex items-center justify-center !right-[6px] !top-[2px]':
              day.isToday && !day.isSelected,
            'font-bold !text-white bg-[#BA8E5F] rounded-full w-6 h-6 flex items-center justify-center !right-1':
              day.isSelected,
          }"
        >
          {{ day.date }}
        </span>

        <!-- 수입 금액 표시 (날짜 아래 작게) -->
        <div
          v-if="day.workData && day.isCurrentMonth"
          class="absolute top-10 left-1/2 -translate-x-1/2 text-[14px] font-medium"
          :class="day.isSelected ? 'text-[#BA8E5F]' : 'text-[#767676]'"
        >
          {{ formatIncome(day.workData.totalIncome) }}
        </div>

        <!-- 기존 일정 정보 (오전/오후 표시) -->
        <!-- <div v-if="day.schedule && day.isCurrentMonth" class="absolute left-1 right-1 top-7"> -->
        <!-- 시간대 표시 -->
        <!-- <div
            class="w-full rounded-md text-right pr-1 mb-1 text-[12px] text-[#111] overflow-hidden text-ellipsis whitespace-nowrap"
            :class="day.schedule.type === '오후' ? 'bg-[rgba(95,201,94,0.2)]' : 'bg-[rgba(69,166,255,0.2)]'"
          >
            <p class="pr-1 m-0">{{ day.schedule.type }}</p>
          </div> -->
        <!-- </div> -->
      </div>
    </div>

    <!-- 선택된 날짜 상세 정보 카드 -->
    <transition name="fade">
      <div v-if="selectedDateInfo" class="w-full bg-white border border-gray-200 rounded-xl mt-6 shadow-md">
        <div class="p-6 border-b border-[#FFEBC2]">
          <!-- 날짜 표시 -->
          <div class="text-sm text-gray-500 font-[SpokaHanSansNeo] mb-4 pb-3 border-b border-gray-100">
            {{ formatDateDisplay(selectedDateInfo.fullDate) }}
          </div>

          <!-- 주요 정보 3개 -->
          <div class="grid grid-cols-3 gap-4 mb-5">
            <div class="text-center">
              <p class="text-xs text-gray-500 font-[SpokaHanSansNeo] mb-2">총 근무 시간</p>
              <p class="text-lg font-bold font-[Cafe24Surround] text-gray-800">{{ selectedDateInfo.workHours }}</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 font-[SpokaHanSansNeo] mb-2">총 배송 건수</p>
              <p class="text-lg font-bold font-[Cafe24Surround] text-gray-800">
                {{ selectedDateInfo.deliveryCount }}건
              </p>
            </div>
            <div class="text-center">
              <p class="text-xs text-gray-500 font-[SpokaHanSansNeo] mb-2">기본 수입</p>
              <p class="text-lg font-bold font-[Cafe24Surround] text-gray-800">
                {{ formatMoney(selectedDateInfo.baseIncome) }}
              </p>
            </div>
          </div>

          <!-- 인센티브 세부 항목 -->
          <div class="space-y-2">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-600 font-[SpokaHanSansNeo]">빠른 응답 인센티브</span>
              <span class="text-gray-800 font-medium font-[SpokaHanSansNeo]">{{
                formatMoney(selectedDateInfo.quickResponseBonus)
              }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-600 font-[SpokaHanSansNeo]">근무지역 외 배송 수당</span>
              <span class="text-gray-800 font-medium font-[SpokaHanSansNeo]">{{
                formatMoney(selectedDateInfo.longDistanceBonus)
              }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-600 font-[SpokaHanSansNeo]">우천 배송 수당</span>
              <span class="text-gray-800 font-medium font-[SpokaHanSansNeo]">{{
                formatMoney(selectedDateInfo.weatherBonus)
              }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-600 font-[SpokaHanSansNeo]">피크타임 수당</span>
              <span class="text-gray-800 font-medium font-[SpokaHanSansNeo]">{{
                formatMoney(selectedDateInfo.peakTimeBonus)
              }}</span>
            </div>
          </div>
        </div>

        <!-- 총 수입 -->
        <div class="bg-[#FFFBF2] rounded-lg p-4 px-6">
          <div class="flex justify-between items-center">
            <span class="text-base font-semibold font-[SpokaHanSansNeo] text-gray-700">총 수입</span>
            <span class="text-2xl font-bold font-[Cafe24Surround] text-[#50311D]">{{
              formatMoney(selectedDateInfo.totalIncome)
            }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "CalendarComponent",
  data() {
    const today = new Date();
    return {
      currentYear: 2025,
      currentMonth: 10,
      today: {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        date: today.getDate(),
      },
      selectedDate: null,
      
      // 샘플 일정 데이터
      schedules: {
        "2025-10-1": { amount: "34,200" },
        "2025-10-2": { amount: "36,720" },
        "2025-10-3": { amount: "34,350" },
        "2025-10-4": { amount: "33,850" },
        "2025-10-8": { amount: "21,850" },
        "2025-10-9": { amount: "22,850" },
        "2025-10-10": { amount: "30,850" },
        "2025-10-11": { amount: "20,850" },
        "2025-10-15": { amount: "20,350" },
        "2025-10-16": { amount: "21,250" },
        "2025-10-17": { amount: "30,100" },
        "2025-10-18": { amount: "20,200" },
        "2025-10-22": { amount: "21,400" },
        "2025-10-23": { amount: "20,150" },
        "2025-10-24": { amount: "30,800" },
        "2025-10-25": { amount: "22,150" },
        "2025-10-27": { amount: "20,150" },
        "2025-10-29": { amount: "21,350" },
      },

      // 근무 상세 데이터
      workData: {
        "2025-10-1": {
          workHours: "7시간 30분",
          deliveryCount: 28,
          baseIncome: 28000,
          quickResponseBonus: 3000,
          longDistanceBonus: 2000,
          weatherBonus: 0,
          peakTimeBonus: 1200,
          totalIncome: 34200,
        },
        "2025-10-2": {
          workHours: "8시간 10분",
          deliveryCount: 32,
          baseIncome: 30000,
          quickResponseBonus: 3500,
          longDistanceBonus: 2200,
          weatherBonus: 0,
          peakTimeBonus: 1020,
          totalIncome: 36720,
        },
        "2025-10-3": {
          workHours: "7시간 20분",
          deliveryCount: 29,
          baseIncome: 28500,
          quickResponseBonus: 3000,
          longDistanceBonus: 1850,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 34350,
        },
        "2025-10-4": {
          workHours: "7시간 00분",
          deliveryCount: 27,
          baseIncome: 27500,
          quickResponseBonus: 3000,
          longDistanceBonus: 2350,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 33850,
        },
        "2025-10-8": {
          workHours: "5시간 30분",
          deliveryCount: 18,
          baseIncome: 18000,
          quickResponseBonus: 2000,
          longDistanceBonus: 850,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 21850,
        },
        "2025-10-9": {
          workHours: "5시간 40분",
          deliveryCount: 19,
          baseIncome: 19000,
          quickResponseBonus: 2000,
          longDistanceBonus: 850,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 22850,
        },
        "2025-10-10": {
          workHours: "6시간 50분",
          deliveryCount: 25,
          baseIncome: 25000,
          quickResponseBonus: 2500,
          longDistanceBonus: 2350,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 30850,
        },
        "2025-10-11": {
          workHours: "5시간 20분",
          deliveryCount: 17,
          baseIncome: 17000,
          quickResponseBonus: 2000,
          longDistanceBonus: 850,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 20850,
        },
        "2025-10-15": {
          workHours: "5시간 10분",
          deliveryCount: 16,
          baseIncome: 16000,
          quickResponseBonus: 2000,
          longDistanceBonus: 1350,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 20350,
        },
        "2025-10-16": {
          workHours: "5시간 30분",
          deliveryCount: 17,
          baseIncome: 17500,
          quickResponseBonus: 2000,
          longDistanceBonus: 750,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 21250,
        },
        "2025-10-17": {
          workHours: "6시간 40분",
          deliveryCount: 24,
          baseIncome: 24500,
          quickResponseBonus: 2500,
          longDistanceBonus: 2100,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 30100,
        },
        "2025-10-18": {
          workHours: "5시간 00분",
          deliveryCount: 16,
          baseIncome: 16000,
          quickResponseBonus: 2000,
          longDistanceBonus: 1200,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 20200,
        },
        "2025-10-22": {
          workHours: "5시간 35분",
          deliveryCount: 17,
          baseIncome: 17500,
          quickResponseBonus: 2000,
          longDistanceBonus: 900,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 21400,
        },
        "2025-10-23": {
          workHours: "5시간 05분",
          deliveryCount: 16,
          baseIncome: 16000,
          quickResponseBonus: 2000,
          longDistanceBonus: 1150,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 20150,
        },
        "2025-10-24": {
          workHours: "6시간 45분",
          deliveryCount: 25,
          baseIncome: 25000,
          quickResponseBonus: 2500,
          longDistanceBonus: 2300,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 30800,
        },
        "2025-10-25": {
          workHours: "5시간 45분",
          deliveryCount: 18,
          baseIncome: 18000,
          quickResponseBonus: 2000,
          longDistanceBonus: 1150,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 22150,
        },
        "2025-10-27": {
          workHours: "5시간 05분",
          deliveryCount: 16,
          baseIncome: 16000,
          quickResponseBonus: 2000,
          longDistanceBonus: 1150,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 20150,
        },
        "2025-10-29": {
          workHours: "5시간 35분",
          deliveryCount: 17,
          baseIncome: 17500,
          quickResponseBonus: 2000,
          longDistanceBonus: 850,
          weatherBonus: 0,
          peakTimeBonus: 1000,
          totalIncome: 21350,
        },
      },
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
    prevMonth() {
      if (this.currentMonth === 1) {
        this.currentMonth = 12;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.selectedDate = null;
    },
    nextMonth() {
      if (this.currentMonth === 12) {
        this.currentMonth = 1;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.selectedDate = null;
    },
    selectDate(day) {
      if (!day.isCurrentMonth) return;
      if (!day.workData) return; // 근무 데이터 없으면 클릭 불가

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

/* 반응형 */
@media screen and (max-width: 768px) {
  .h-24 {
    height: 80px;
  }
}
</style>
