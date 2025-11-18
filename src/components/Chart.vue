<template>
  <div class="w-full h-full">
    <!-- 차트와 범례 영역 (중앙 배치) -->
    <div class="flex items-start justify-center gap-3">
      <!-- 차트 -->
      <div ref="chartRef" class="flex-1" style="height: 280px; max-width: 600px"></div>

      <!-- 범례 (오른쪽) -->
      <div class="flex flex-col gap-2 pt-50">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-[#BA8E5F] rounded"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">직접 예약건수</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-[#FFEBC2] rounded"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">픽업 예약건수</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

// Props로 필터 값 받기
const props = defineProps({
  year: {
    type: String,
    default: "2025",
  },
  month: {
    type: String,
    default: "10",
  },
  week: {
    type: String,
    default: "3",
  },
  viewType: {
    type: String,
    default: "weekly",
  },
});

const chartRef = ref(null);
let chartInstance = null;

const weeklyData = {
  10: {
    1: { direct: 100, pickup: 320 },
    2: { direct: 302, pickup: 132 },
    3: { direct: 301, pickup: 101 },
    4: { direct: 334, pickup: 134 },
    5: { direct: 365, pickup: 185 },
  },
  11: {
    1: { direct: 390, pickup: 90 },
    2: { direct: 330, pickup: 230 },
    3: { direct: 320, pickup: 210 },
    4: { direct: 285, pickup: 175 },
    5: { direct: 340, pickup: 205 },
  },
  12: {
    1: { direct: 350, pickup: 195 },
    2: { direct: 310, pickup: 220 },
  },
};

const monthlyData = {
  10: { direct: 937, pickup: 687 },
  11: { direct: 1325, pickup: 705 },
  12: { direct: 1365, pickup: 805 },
};

const updateChart = () => {
  if (!chartInstance) return;

  let xAxisData, directData, pickupData;

  if (props.viewType === "weekly") {
    xAxisData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekData = weeklyData[props.month]?.[props.week] || { direct: 0, pickup: 0 };
    const dayDistribution = [0.12, 0.15, 0.14, 0.16, 0.18, 0.15, 0.1];
    directData = dayDistribution.map((r) => Math.round(weekData.direct * r * 7));
    pickupData = dayDistribution.map((r) => Math.round(weekData.pickup * r * 7));
  } else {
    xAxisData = ["10월", "11월", "12월"];
    directData = [monthlyData["10"].direct, monthlyData["11"].direct, monthlyData["12"].direct];
    pickupData = [monthlyData["10"].pickup, monthlyData["11"].pickup, monthlyData["12"].pickup];
  }

  chartInstance.setOption({
    color: ["#FFEBC2", "#BA8E5F"],
    legend: {
      show: false,
    },
    grid: { left: "8%", right: "5%", bottom: "8%", top: "8%", containLabel: true },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLine: { lineStyle: { color: "#E5E5E5" } },
      axisTick: { show: false },
      axisLabel: { color: "#666", fontSize: 12 },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#F0F0F0" } },
      axisLabel: { color: "#999", fontSize: 11 },
    },
    series: [
      {
        name: "기사 픽업 예약건수",
        type: "bar",
        stack: "total",
        barWidth: props.viewType === "weekly" ? "60%" : "45%",
        itemStyle: { color: "#FFEBC2" },
        emphasis: { itemStyle: { color: "#FFE9B0" } },
        label: { show: true, position: "inside", color: "#8B7355", fontSize: 11, fontWeight: 500 },
        data: directData,
      },
      {
        name: "직접 예약건수",
        type: "bar",
        stack: "total",
        barWidth: props.viewType === "weekly" ? "60%" : "45%",
        itemStyle: { color: "#BA8E5F", borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { color: "#C59B6D" } },
        label: { show: true, position: "inside", color: "#FFF", fontSize: 11, fontWeight: 500 },
        data: pickupData,
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderColor: "transparent",
      textStyle: { color: "#fff" },
    },
  });
};

onMounted(async () => {
  if (!window.echarts) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://fastly.jsdelivr.net/npm/echarts@5/dist/echarts.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  chartInstance = window.echarts.init(chartRef.value);
  updateChart();
  window.addEventListener("resize", () => chartInstance.resize());
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", () => chartInstance?.resize());
  chartInstance?.dispose();
});

watch(() => [props.year, props.month, props.week, props.viewType], updateChart);
</script>
