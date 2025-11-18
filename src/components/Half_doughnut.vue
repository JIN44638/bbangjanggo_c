<template>
  <div class="chart-wrap">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";

const chartRef = ref(null);
let chartInstance = null;

const chartData = ref([
  { value: 1048, name: "Search Engine", color: "#FFEBC2" },
  { value: 735, name: "Direct", color: "#BA8E5F" },
  { value: 580, name: "Email", color: "#FFF2D5" },
  { value: 484, name: "Union Ads", color: "#A36031" },
  { value: 300, name: "Video Ads", color: "#50311D" },
]);

// ✅ CDN으로 echarts 로드
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

const updateChart = () => {
  if (!chartInstance) return;

  const option = {
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        return `
          <div style="padding:4px 8px;">
            <strong>${params.name}</strong><br>
            값: <b>${params.value}</b><br>
          </div>
        `;
      },
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "70%"],
        startAngle: 180,
        endAngle: 360,
        avoidLabelOverlap: false,
        padAngle: 5, // ✅ 조각 사이 간격
        itemStyle: {
          borderRadius: 4, // ✅ 모서리 둥글게
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          scale: false, // ✅ hover 시 크기 변화 없음
          itemStyle: {
            shadowBlur: 0, // ✅ hover 시 그림자 효과 제거
          },
        },
        data: chartData.value.map((item) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: item.color,
          },
          emphasis: {
            itemStyle: {
              color: item.color, // ✅ hover 시에도 동일한 색상 유지
            },
          },
        })),
      },
    ],
  };

  chartInstance.setOption(option);
};

onMounted(async () => {
  const echarts = await loadEcharts();
  chartInstance = echarts.init(chartRef.value);

  updateChart();

  window.addEventListener("resize", chartInstance.resize);
});

onBeforeUnmount(() => {
  if (chartInstance) {
    window.removeEventListener("resize", chartInstance.resize);
    chartInstance.dispose();
  }
});
</script>

<style scoped>
.chart-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.color-inputs {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-item label {
  font-size: 14px;
  color: #666;
}

.color-item input[type="color"] {
  width: 40px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.chart {
  width: 100%;
  max-width: 600px;
  height: 400px;
}
</style>
