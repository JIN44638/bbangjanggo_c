<template>
  <span :class="badgeClass" class="inline-flex px-2 py-1 rounded-full text-xs font-medium items-center gap-1 w-auto">
    <!-- label 텍스트 -->
    <span>{{ label }}</span>

    <!-- 미배정일 때만 느낌표 아이콘 -->
    <i v-if="type === '미배정'" class="fas fa-exclamation-circle text-yellow-500"></i>
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const badgeClass = computed(() => {
  switch (props.type) {
    case "실온":
      return "bg-green-100 text-green-800";
    case "냉장":
      return "bg-blue-100 text-blue-800";
    case "냉동":
      return "bg-indigo-100 text-indigo-800";
    case "예약완료":
      return "bg-purple-100 text-purple-800";
    case "배차완료":
      return "bg-orange-100 text-orange-800";
    case "입고완료":
      return "bg-gray-100 text-gray-800";
    // 운송수단 색상 (오렌지 계열)
    case "오토바이":
      return "bg-orange-100 text-orange-800"; // 오토바이
    case "도보":
      return "bg-yellow-100 text-yellow-800"; // 도보
    case "자전거":
      return "bg-red-100 text-red-800"; // 자전거

    // 배정지역 색상 (파랑 계열)
    case "중구":
      return "bg-blue-100 text-blue-800"; // 중구
    case "동구":
      return "bg-teal-100 text-teal-800"; // 동구
    case "서구":
      return "bg-indigo-100 text-indigo-800"; // 서구
    case "남구":
      return "bg-cyan-100 text-cyan-800"; // 남구
    case "북구":
      return "bg-sky-100 text-sky-800"; // 북구
    case "달서구":
      return "bg-blue-200 text-blue-800"; // 달서구
    case "달성군":
      return "bg-indigo-200 text-indigo-800"; // 달성군

    // 근무상태 색상만 별도로 설정
    case "배차중":
      return "bg-green-100 text-green-800"; // 배차중
    case "대기중":
      return "bg-yellow-100 text-yellow-800"; // 대기중
    case "휴무":
      return "bg-gray-100 text-gray-800"; // 휴무

    case "취소":
      return "bg-red-100 text-red-800";

    case "미배정":
      return "text-red-500";
    default:
      return "text-gray-800";
  }
});
</script>
