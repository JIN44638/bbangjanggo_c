<template>
  <div class="flex justify-center items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700">
    <div class="flex gap-2">

      <!-- 이전 버튼 -->
      <button
        @click="$emit('prev')"
        :disabled="currentPage === 1"
        class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded 
               hover:bg-gray-50 dark:hover:bg-gray-700 
               disabled:opacity-50 disabled:cursor-not-allowed
               text-gray-700 dark:text-gray-300"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <!-- 페이지 목록 -->
      <button
        v-for="page in pages"
        :key="page"
        @click="$emit('goto', page)"
        :class="[
          currentPage === page
            ? 'bg-[#BA8E5F] text-white border-[#BA8E5F]'
            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
          'px-3 py-1 border rounded'
        ]"
      >
        {{ page }}
      </button>

      <!-- 다음 버튼 -->
      <button
        @click="$emit('next')"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded 
               hover:bg-gray-50 dark:hover:bg-gray-700 
               disabled:opacity-50 disabled:cursor-not-allowed
               text-gray-700 dark:text-gray-300"
      >
        <i class="fas fa-chevron-right"></i>
      </button>

    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const maxDisplay = 5;

// 표시할 페이지 계산
const pages = computed(() => {
  const arr = [];
  let start = Math.max(1, props.currentPage - 2);
  let end = Math.min(props.totalPages, start + maxDisplay - 1);

  if (end - start < maxDisplay - 1) {
    start = Math.max(1, end - maxDisplay + 1);
  }

  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
});
</script>
