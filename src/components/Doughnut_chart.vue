<template>
  <div class="w-full ">
    <!-- 차트와 범례 영역 (중앙 배치) -->
    <div class="flex items-start justify-center gap-3">
      <!-- 차트 -->
      <div ref="chartRef" class="flex-1 h-[330px] min-w-[330px] "></div>
      
      <!-- 범례 (오른쪽) -->
      <div class="flex flex-col gap-2 pt-40">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #BA8E5F;"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">활동중 기사</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #8B5A2B;"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">배차 완료</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #FFEBC2;"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">배차 대기</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #FFB347;"></div>
          <span class="text-xs text-gray-700 whitespace-nowrap">취소</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="background-color: #3E2723;"></div>
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
    { value: 3, name: "지연" }
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
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      show: false
    },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: `총 ${total} 건`,
          fontSize: 20,
          fontWeight: 'bold',
          fill: '#333'
        }
      }
    ],
    series: [
      {
        name: "배차 현황",
        type: "pie",
        radius: ["30%", "70%"], // 도넛 두께 
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        padAngle: 3,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        emphasis: {
          scale: false,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        data: chartData.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: colors[index]
          }
        }))
      }
    ]
  };

  chartInstance.setOption(option);
  
  const handleResize = () => {
    if (chartInstance) {
      chartInstance.resize();
    }
  };
  
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  if (chartInstance) {
    window.removeEventListener("resize", handleResize);
    chartInstance.dispose();
  }
});
</script>