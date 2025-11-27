<template>
  <span
    :class="badgeClass"
    class="inline-flex px-2 py-1 rounded-full text-xs font-medium items-center gap-1 w-auto"
  >
    <!-- label 텍스트 -->
    <span>{{ label }}</span>

    <!-- 미배정일 때만 느낌표 아이콘 -->
    <i
      v-if="type === '미배정'"
      class="fas fa-exclamation-circle text-yellow-500"
    ></i>
  </span>
</template>

<script setup>
import { computed } from 'vue';

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
    case '실온':
      return 'bg-green-100 text-green-800';
    case '냉장':
      return 'bg-blue-100 text-blue-800';
    case '냉동':
      return 'bg-indigo-100 text-indigo-800';
    case '예약완료':
      return 'bg-purple-100 text-purple-800';
    case '배차완료':
      return 'bg-orange-100 text-orange-800';
    case '입고완료':
      return 'bg-gray-100 text-gray-800';
      case '취소':
      return 'bg-red-100 text-red-800';
    case '미배정':
      return 'text-red-500';
    default:
      return 'text-gray-800';
  }
});
</script>
