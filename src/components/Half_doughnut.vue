<template>
  <div class="w-full h-full flex items-center justify-center">
    <!-- 차트와 범례 영역 -->
    <div class="w-full flex items-center justify-center gap-6 h-full relative">
      <!-- 차트 -->
      <div ref="chartRef" style="width: 350px; height: 350px"></div>

      <!-- 범례 (오른쪽) -->
      <div class="flex flex-col gap-2 pl-10 absolute top-1/2 -translate-y-1/2 right-8">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #3e2723"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">반월당역점</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #8b5a2b"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">경대병원역점</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #ffebc2"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">동대구역점</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #ba8e5f"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">서대구역점</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #ffe8cc"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">대구국제공항점</span>
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

  // 색상 정의 (이미지 기준)
  const colors = ["#3E2723", "#8B5A2B", "#FFEBC2", "#BA8E5F", "#FFE8CC"];

  const chartData = [
    { value: 148, name: "반월당역점", color: colors[0] },
    { value: 55, name: "경대병원역점", color: colors[1] },
    { value: 80, name: "동대구역점", color: colors[2] },
    { value: 84, name: "서대구역점", color: colors[3] },
    { value: 30, name: "대구국제공항점", color: colors[4] },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const option = {
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        return `
          <div style="padding:4px 8px;">
            <strong>${params.name}</strong><br>
            ${params.value}건
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
        top: "68%",
        style: {
          text: `총 ${total}건`,
          fontSize: 16,
          fontWeight: "bold",
          fill: "#333",
        },
      },
    ],
    series: [
      {
        name: "지점별 예약 분포",
        type: "pie",
        radius: ["40%", "85%"],
        center: ["50%", "75%"],
        startAngle: 180,
        endAngle: 360,
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
        data: chartData.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: item.color,
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
