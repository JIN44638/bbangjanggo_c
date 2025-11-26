<template>
  <div v-if="visible" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-4 animate-fadeIn">
      <!-- 헤더 -->
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-lg font-bold text-red-600 flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation"></i>
          긴급 처리 알림
        </h2>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <!-- 리스트 -->
      <div class="space-y-2 max-h-72 overflow-y-auto pt-1 pr-1">
        <div
          v-for="item in alerts"
          :key="item.id"
          class="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-none"
        >
          <!-- 왼쪽 텍스트 (여백 추가됨) -->
          <p class="text-sm text-gray-800 dark:text-gray-200 truncate pl-2">
            <span class="font-semibold">{{ item.category }}</span>
            - {{ item.text }}
          </p>

          <!-- 오른쪽 끝 체크 아이콘 -->
          <i
            class="fa-solid fa-circle-check text-lg cursor-pointer flex-shrink-0 ml-4"
            :class="item.checked ? 'text-green-500' : 'text-gray-300'"
            @click="toggleCheck(item)"
          ></i>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex justify-end mt-2 mr-1">
        <button
          class="px-3 py-1.5 rounded bg-[#BA8E5F] text-white text-sm font-semibold hover:bg-[#A67B54] transition"
          @click="confirmAll"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  alerts: Array,
});

const emit = defineEmits(["update:visible", "update:alerts", "allChecked"]);

const close = () => emit("update:visible", false);

const toggleCheck = (item) => {
  item.checked = !item.checked;
  emit("update:alerts", props.alerts);
};

const confirmAll = () => {
  emit("update:alerts", props.alerts); // 체크된 상태만 반영
  close();
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
</style>
