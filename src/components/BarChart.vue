<template>
  <div class="w-full h-full">
    <!-- 차트 영역 (중앙 배치) -->
    <div class="flex items-start justify-center">
      <!-- 차트 -->
      <div ref="chartRef" class="flex-1" style="height: 280px; max-width: 600px"></div>
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

// 주차별 매출 데이터 (2025년 10월~12월)
const weeklyData = {
  10: {
    1: [120, 200, 150, 80, 70, 110, 130],
    2: [180, 220, 190, 160, 140, 170, 200],
    3: [150, 180, 160, 120, 100, 130, 170],
    4: [200, 250, 220, 180, 160, 190, 210],
    5: [200, 250, 220, 180, 160, 190, 210],
  },
  11: {
    1: [190, 230, 210, 170, 150, 180, 200],
    2: [170, 210, 180, 150, 130, 160, 190],
    3: [210, 260, 230, 190, 170, 200, 220],
    4: [160, 200, 170, 140, 120, 150, 180],
    5: [200, 250, 220, 180, 160, 190, 210],
  },
  12: {
    1: [220, 270, 240, 200, 180, 210, 230],
    2: [180, 220, 190, 160, 140, 170, 200],

  },
};

// 월별 매출 데이터 (각 월의 평균)
const monthlyData = {
  10: [155, 212, 180, 135, 117, 150, 177],
  11: [182, 225, 197, 162, 142, 172, 197],
  12: [210, 257, 227, 190, 170, 200, 222],
};

const updateChart = () => {
  if (!chartInstance) return;

  let xAxisData, chartData;

  if (props.viewType === "weekly") {
    xAxisData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    chartData = weeklyData[props.month]?.[props.week] || [0, 0, 0, 0, 0, 0, 0];
  } else {
    xAxisData = ["10월", "11월", "12월"];
    // 월별로 각 요일의 평균을 계산
    chartData = [
      Math.round(monthlyData["10"].reduce((a, b) => a + b, 0) / 7),
      Math.round(monthlyData["11"].reduce((a, b) => a + b, 0) / 7),
      Math.round(monthlyData["12"].reduce((a, b) => a + b, 0) / 7),
    ];
  }

  const color = "#BA8E5F";
  const hoverColor = "#C59B6D";

  chartInstance.setOption({
    color: [color],
    grid: {
      left: "8%",
      right: "5%",
      bottom: "8%",
      top: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xAxisData,
      axisLine: {
        lineStyle: { color: "#E5E5E5" },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#666",
        fontSize: 12,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: { color: "#F0F0F0" },
      },
      axisLabel: {
        color: "#999",
        fontSize: 11,
      },
    },
    series: [
      {
        data: chartData,
        type: "bar",
        barWidth: props.viewType === "weekly" ? "60%" : "45%",
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: color,
        },
        emphasis: {
          itemStyle: {
            color: hoverColor,
          },
        },
        label: {
          show: true,
          position: "top",
          color: "#666",
          fontSize: 11,
          fontWeight: 500,
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderColor: "transparent",
      textStyle: {
        color: "#fff",
      },
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
