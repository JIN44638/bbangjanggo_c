<template>
  <div class="w-full min-w-[600px] bg-gray-100 dark:bg-gray-900 px-3">
    <div class="relative h-16 overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-xs">
      <div 
        class="ease-in-out"
        :class="isResetting ? 'transition-none' : 'transition-transform duration-700'"
        :style="{ transform: `translateY(-${displayIndex * 64}px)` }"
      >
        <div
          v-for="(alert, index) in displayAlerts"
          :key="index"
          class="h-16 flex items-center  px-10 gap-3 bg-white dark:bg-gray-800"
        >
          <!-- 아이콘 -->
          <div 
            :class="['w-8 h-8 rounded-full flex items-center justify-center', alert.iconBgColor]"
          >
            <i :class="[alert.icon, alert.iconColor, 'text-lg']"></i>
          </div>
          
          <!-- 텍스트 -->
          <div class="flex items-center gap-2">
            <span class="text-base font-bold text-gray-900 dark:text-white">
              {{ alert.title }}
            </span>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ alert.description }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <!-- <div class="flex justify-center mt-3 gap-1">
      <button
        v-for="(_, index) in alerts"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'h-1.5 rounded-full transition-all',
          currentIndex === index 
            ? 'w-6 bg-gray-600 dark:bg-gray-400' 
            : 'w-1.5 bg-gray-300 dark:bg-gray-600'
        ]"
      />
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const currentIndex = ref(0);
const displayIndex = ref(0);
const isResetting = ref(false);
let interval = null;

const alerts = [
  {
    type: 'warning',
    icon: 'fas fa-exclamation-circle',
    iconColor: 'text-yellow-500',
    iconBgColor: 'bg-yellow-100 dark:bg-yellow-900',
    title: '수거 지연',
    description: '공주당 픽업시간이 30분이상 지연되고 있습니다.'
  },
  {
    type: 'success',
    icon: 'fas fa-check-circle',
    iconColor: 'text-green-500',
    iconBgColor: 'bg-green-100 dark:bg-green-900',
    title: '입고 완료',
    description: '#bba***(소베빵집), 대구역 보관소 입고되었습니다.'
  },
  {
    type: 'danger',
    icon: 'fas fa-exclamation-triangle',
    iconColor: 'text-red-500',
    iconBgColor: 'bg-red-100 dark:bg-red-900',
    title: '사고 발생',
    description: '이진수 기사님 13시경 사고 발생으로 픽업이 지연되고 있습니다.'
  },
  {
    type: 'warning',
    icon: 'fas fa-exclamation-circle',
    iconColor: 'text-yellow-500',
    iconBgColor: 'bg-yellow-100 dark:bg-yellow-900',
    title: '긴급 공지',
    description: '오늘 오후 3시부터 시스템 점검이 예정되어 있습니다.'
  },
  {
    type: 'success',
    icon: 'fas fa-check-circle',
    iconColor: 'text-green-500',
    iconBgColor: 'bg-green-100 dark:bg-green-900',
    title: '입고 완료',
    description: '대구공항점 예약건 전체 입고 처리 완료되었습니다.'
  },
  {
    type: 'danger',
    icon: 'fas fa-exclamation-triangle',
    iconColor: 'text-red-500',
    iconBgColor: 'bg-red-100 dark:bg-red-900',
    title: '지연 안내',
    description: '중구 지역 교통 체증으로 배송이 30분 이상 지연되고 있습니다.'
  },
  {
    type: 'warning',
    icon: 'fas fa-exclamation-circle',
    iconColor: 'text-yellow-500',
    iconBgColor: 'bg-yellow-100 dark:bg-yellow-900',
    title: '날씨 경보',
    description: '폭우로 인한 일부 지역 배송 차질이 예상됩니다.'
  },
  {
    type: 'success',
    icon: 'fas fa-check-circle',
    iconColor: 'text-green-500',
    iconBgColor: 'bg-green-100 dark:bg-green-900',
    title: '입고 완료',
    description: '#flo***(따따따빵집), 반월당역 보관소 입고되었습니다.'
  },
  {
    type: 'warning',
    icon: 'fas fa-exclamation-circle',
    iconColor: 'text-yellow-500',
    iconBgColor: 'bg-yellow-100 dark:bg-yellow-900',
    title: '물량 증가',
    description: '내일 대구축제로 인해 예약건 평소보다 2배 증가 예정입니다.'
  },
  {
    type: 'success',
    icon: 'fas fa-check-circle',
    iconColor: 'text-green-500',
    iconBgColor: 'bg-green-100 dark:bg-green-900',
    title: '입고 완료',
    description: '#diso***(고려베이커리), 동대구역 보관소 입고되었습니다.'
  }
];

// 첫 번째 아이템을 마지막에 추가하여 무한 루프 효과
const displayAlerts = computed(() => [...alerts, alerts[0]]);

const goToSlide = (index) => {
  if (interval) {
    clearInterval(interval);
  }
  currentIndex.value = index;
  displayIndex.value = index;
  startInterval();
};

const startInterval = () => {
  interval = setInterval(() => {
    displayIndex.value = displayIndex.value + 1;
    
    // 마지막 슬라이드(복제된 첫 번째) 도달 후
    if (displayIndex.value === alerts.length) {
      setTimeout(() => {
        // 트랜지션 끄고 즉시 첫 번째로 이동
        isResetting.value = true;
        displayIndex.value = 0;
        currentIndex.value = 0;
        
        // 다음 프레임에서 트랜지션 다시 켜기
        setTimeout(() => {
          isResetting.value = false;
        }, 50);
      }, 700); // transition 완료 후
    }
    
    // currentIndex 업데이트 (페이지네이션용)
    currentIndex.value = displayIndex.value >= alerts.length ? 0 : displayIndex.value;
  }, 3000);
};

onMounted(() => {
  startInterval();
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>