<template>
  <div class="w-full h-full">
    <!-- 차트와 범례 영역 -->
    <div class="flex items-center justify-center gap-6 h-full relative">
      <!-- 차트 -->
      <div ref="chartRef" class="h-full" style="width: 280px; height: 280px"></div>

      <!-- 범례 (오른쪽) -->
      <div class="flex flex-col gap-2 absolute top-1/2 -translate-y-1/2 right-8">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #ba8e5f"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">활동중 기사</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #8b5a2b"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">배차 완료</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #ffebc2"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">배차 대기</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #ffb347"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">취소</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #3e2723"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">지연</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";

const chartRef = ref(null);
let chartInstance = null;

// CDN으로 echarts 로드
const loadEcharts = () => {
  return new Promise((resolve, reject) => {
    if (window.echarts) {
      resolve(window.echarts);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js";
    script.onload = () => resolve(window.echarts);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

onMounted(async () => {
  const echarts = await loadEcharts();
  chartInstance = echarts.init(chartRef.value);

  // 피그마 디자인 색상
  const colors = ["#BA8E5F", "#8B5A2B", "#FFEBC2", "#FFB347", "#3E2723"];

  const chartData = [
    { value: 8, name: "활동중 기사" },
    { value: 7, name: "배차 완료" },
    { value: 10, name: "배차 대기" },
    { value: 3, name: "취소" },
    { value: 3, name: "지연" },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const option = {
    color: colors,
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        return `
          <div style="padding:4px 8px;">
            <strong>${params.name}</strong><br>
            ${params.value}건 (${params.percent}%)
          </div>
        `;
      },
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderColor: "transparent",
      textStyle: {
        color: "#fff",
      },
    },
    legend: {
      show: false,
    },
    graphic: [
      {
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: `총 ${total} 건`,
          fontSize: 20,
          fontWeight: "bold",
          fill: "#333",
        },
      },
    ],
    series: [
      {
        name: "배차 현황",
        type: "pie",
        radius: ["45%", "98%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        padAngle: 3,
        itemStyle: {
          borderRadius: 6,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          scale: false,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.3)",
          },
        },
        data: chartData.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: colors[index],
          },
        })),
      },
    ],
  };

  chartInstance.setOption(option);

  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  if (chartInstance) {
    window.removeEventListener("resize", handleResize);
    chartInstance.dispose();
  }
});
</script>
