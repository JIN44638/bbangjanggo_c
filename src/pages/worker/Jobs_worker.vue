<template>
  <div class="w-full max-w-[768px] mx-auto font-[SpokaHanSansNeo] font-normal relative" style="height: 100vh">
    <!-- 배송 목록 화면 -->
    <div v-show="showDeliveryList" class="w-full h-full bg-white overflow-y-auto pb-20 sm:pb-25">
      <div>
        <!-- 상단 고정 (진행 정보 + 탭) -->
        <div class="h-[110px] sm:h-[120px] w-full max-w-[768px] fixed bg-white z-999 pl-4 sm:pl-[25px] pr-23 sm:pr-[90px] pt-2">
          <div class="w-full max-w-[600px] flex flex-col gap-2">
            <!-- 진행 문구 -->
            <div class="flex place-content-between items-center mt-3 sm:mt-4">
              <p class="text-base sm:text-xl">{{ remainingCount }}건만 더 하면 배달 완료! <span class="hidden sm:inline">힘내세요!</span></p>
              <span class="text-sm sm:text-base">{{ remainingCount }}/{{ totalCount }}</span>
            </div>

            <!-- 프로그레스바 -->
            <div class="w-full mb-2 mt-1 sm:mt-2">
              <div class="w-full h-2.5 sm:h-3 bg-gray-200 rounded-full">
                <div
                  class="h-full bg-[#50311D] rounded-full transition-all duration-500 ease-out"
                  :style="{ width: progressPercent + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 탭 필터 (전체 / 배정순 / 픽업 / 배송 / 완료) -->
          <div class="flex gap-1.5 sm:gap-2 items-center mt-2 overflow-x-auto scrollbar-hide">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="setFilter(tab.key)"
              :class="[
                'px-2.5 sm:px-3 py-1 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0',
                currentFilter === tab.key ? 'bg-[#50311D] text-white' : 'bg-gray-100 text-gray-700',
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- 배송 카드들 (transition-group: reorder 애니메이션) -->
        <div class="space-y-3 sm:space-y-4 pt-[120px] sm:pt-[140px] px-4 sm:px-6" :key="currentFilter">
          <transition-group name="list" tag="div">
            <div
              v-for="delivery in filteredDeliveryList"
              :key="delivery.reservationNo"
              class="rounded-lg transition-opacity duration-300 shadow-md relative overflow-hidden mb-4 sm:mb-5"
              :class="[
                'bg-white',
                delivery.status === 'completed' ? 'opacity-60' : '',
                bufferingSet.has(delivery.reservationNo) ? 'buffering' : '',
                shiftingSet.has(delivery.reservationNo) ? 'slide-out-left' : '',
              ]"
            >
              <!-- 배송카드 상단 예약정보 및 손님정보 -->
              <div
                class="flex justify-between items-start p-3 sm:p-5 rounded-t-lg"
                :class="delivery.status === 'completed' ? 'bg-gray-300' : 'bg-[#ba8e5f]'"
              >
                <p class="text-xs sm:text-sm text-gray-50">예약: {{ delivery.reservationNo }}</p>
                <p class="text-xs sm:text-sm text-gray-50">
                  {{ delivery.customerName }} · 
                  <a
                    v-if="delivery.phone"
                    :href="'tel:' + formatTelHref(delivery.phone)"
                    class="text-gray-50 underline"
                  >{{ delivery.phone }}</a>
                </p>
              </div>

              <div class="flex justify-between items-end p-3 sm:p-5">
                <!-- 픽업장소 및 배달장소 -->
                <div class="flex flex-col items-start gap-3 sm:gap-[15px]">
                  <div class="flex items-center">
                    <div class="relative bg-[#ba8e5f] w-8 h-8 sm:w-[40px] sm:h-[40px] rounded-full mr-2 sm:mr-4 flex-shrink-0">
                      <p
                        class="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] whitespace-nowrap text-[11px] sm:text-[13px] text-white font-[SpokaHanSansNeo]"
                      >
                        픽업
                      </p>
                    </div>
                    <p class="text-sm sm:text-base my-2">{{ delivery.storeName }}</p>
                  </div>
                  <div class="flex items-center">
                    <div class="relative bg-[#50311d] w-8 h-8 sm:w-[40px] sm:h-[40px] rounded-full mr-2 sm:mr-4 flex-shrink-0">
                      <p
                        class="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] whitespace-nowrap text-[11px] sm:text-[13px] text-white font-[SpokaHanSansNeo]"
                      >
                        배달
                      </p>
                    </div>
                    <p class="text-sm sm:text-base my-2">보관지점: {{ delivery.storage }}</p>
                  </div>
                </div>

                <!-- 배달리스트 상태 버튼 -->
                <div class="text-sm text-gray-600 space-y-1 flex flex-col items-end gap-8 sm:gap-[35px]">
                  <!-- 간단한 취소 버튼 (리스트에서도 취소 가능) -->
                  <button @click="cancelFromList(delivery)" class="mt-1 text-[10px] sm:text-xs text-gray-500 underline">주문취소</button>
                  
                  <button
                    @click="clickStatusChange(delivery)"
                    :disabled="delivery.status === 'completed'"
                    class="px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm rounded transition-all duration-300 whitespace-nowrap"
                    :class="[
                      getStatusClass(delivery.status, bufferingSet.has(delivery.reservationNo)),
                      delivery.status === 'completed'
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer hover:opacity-80 active:scale-95',
                    ]"
                  >
                    {{ getStatusText(delivery.status, bufferingSet.has(delivery.reservationNo)) }}
                  </button>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

    <!-- 지도 화면 -->
    <div v-show="!showDeliveryList" class="absolute inset-0 w-full h-full" style="overflow: hidden">
      <div id="map" class="w-full h-full"></div>

      <transition name="slide-up">
        <div
          v-if="showPanel"
          class="w-full h-[420px] sm:h-[420px] bg-white absolute bottom-0 left-0 z-999 text-center rounded-t-2xl sm:rounded-t-[1vw] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] pb-8 sm:pb-0"
        >
          <div class="w-full flex flex-row-reverse pt-4 sm:pt-[25px] pb-3 sm:pb-[15px] px-6 sm:px-[50px]">
            <i @click="handleClose" class="fa-solid fa-x text-gray-500 cursor-pointer text-sm sm:text-base"></i>
          </div>

          <!-- 로딩/버퍼 표시 (마커 전환 시) -->
          <div v-if="selectedMarkerLoading" class="py-4">
            <div class="inline-flex items-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                  class="opacity-25"
                ></circle>
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  class="opacity-75"
                ></path>
              </svg>
              <span class="text-sm">로딩 중...</span>
            </div>
          </div>

          <div v-else class="flex flex-col sm:flex-row sm:place-content-between mt-3 sm:mt-[15px] mx-6 sm:mx-[50px] gap-4 sm:gap-0">
            <div class="flex flex-col gap-3 sm:gap-4 text-start">
              <div class="flex">
                <p class="text-gray-400 text-sm sm:text-[16px] w-20 sm:w-[120px]">예약번호</p>
                <span class="text-gray-800 text-sm sm:text-base">{{ selectedMarker?.reservationNo || "—" }}</span>
              </div>
              <div class="flex">
                <p class="text-gray-400 text-sm sm:text-base w-20 sm:w-[120px]">이름</p>
                <span class="text-gray-800 text-sm sm:text-base">{{ selectedMarker?.customerName || "—" }}</span>
              </div>
              <div class="flex items-center">
                <p class="text-gray-400 text-sm sm:text-base w-20 sm:w-[120px]">전화번호</p>
                <a
                  v-if="selectedMarker?.phone"
                  :href="'tel:' + formatTelHref(selectedMarker.phone)"
                  class="text-gray-800 text-sm sm:text-base underline"
                >
                <i class="fa-solid fa-phone text-gray-500 text-xs sm:text-sm mr-1"></i>
                  {{ selectedMarker.phone }}
                </a>
                <span v-else class="text-gray-800 text-sm sm:text-base">—</span>
              </div>
            </div>

            <div class="flex flex-col gap-3 sm:gap-4 text-start">
              <div class="flex">
                <p class="text-gray-400 text-sm sm:text-base w-20 sm:w-[120px]">픽업지점</p>
                <span class="text-gray-800 text-sm sm:text-base">{{ selectedMarker?.title || "—" }}</span>
              </div>
              <div class="flex">
                <p class="text-gray-400 text-sm sm:text-base w-20 sm:w-[120px]">보관지점</p>
                <span class="text-gray-800 text-sm sm:text-base">{{ selectedMarker?.storage || "—" }}</span>
              </div>
              <div class="flex">
                <p class="text-gray-400 text-sm sm:text-base w-20 sm:w-[120px]">상태</p>
                <span
                  class="text-sm sm:text-base font-semibold"
                  :class="{
                    'text-[#E67E50]': deliveryStatus === 'pickup',
                    'text-[#00ADD8]': deliveryStatus === 'delivering',
                    'text-gray-400': deliveryStatus === 'completed',
                  }"
                >
                  {{ statusText }}
                </span>
              </div>
            </div>
          </div>

          <button
            v-if="deliveryStatus !== 'completed'"
            @click="handleCancel"
            class="underline text-xs sm:text-sm text-gray-700 mt-5 sm:mt-[30px] cursor-pointer hover:text-gray-900"
          >
            배송 취소하기
          </button>

          <div class="mt-5 sm:mt-[30px] px-6 sm:px-0">
            <button
              v-if="deliveryStatus === 'pickup'"
              @click="handlePickupComplete"
              class="w-full sm:w-[700px] h-[50px] sm:h-[60px] bg-[#E67E50] text-white text-sm sm:text-base rounded-md cursor-pointer hover:bg-[#D66940] transition-colors"
            >
              픽업 완료
            </button>

            <button
              v-else-if="deliveryStatus === 'delivering'"
              @click="handleDeliveryComplete"
              class="w-full sm:w-[700px] h-[50px] sm:h-[60px] bg-[#00ADD8] text-white text-sm sm:text-base rounded-md cursor-pointer hover:bg-[#15A4C8] transition-colors"
            >
              배송 완료
            </button>

            <button
              v-else-if="deliveryStatus === 'completed'"
              @click="handleClose"
              class="w-full sm:w-[700px] h-[50px] sm:h-[60px] bg-gray-400 text-white text-sm sm:text-base rounded-md cursor-not-allowed"
            >
              ✓ 배송 완료됨 - 닫기
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- 토글 버튼 -->
    <div
      @click="workToggle"
      class="w-12 h-12 sm:w-[50px] sm:h-[50px] bg-[#50311D] absolute top-6 sm:top-[35px] right-5 sm:right-[40px] rounded-full z-[999] transform translate-z-0 cursor-pointer shadow-lg"
    >
      <i
        :class="showDeliveryList ? 'fa-map' : 'fa-bars'"
        class="fa-solid absolute top-[50%] left-[50%] w-full -translate-x-[50%] -translate-y-[50%] text-white text-center text-xl sm:text-2xl"
      ></i>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const showPanel = ref(false);
const selectedMarker = ref(null);
const selectedMarkerInstance = ref(null);
const selectedMarkerLoading = ref(false);
let selectionTimeout = null;

const deliveryStatus = ref("pickup");
const showDeliveryList = ref(false);
let map = null;
let markers = [];

// ✅ 추가: 마커 원본 이미지 정보를 저장하기 위한 맵
const markerOriginalImages = new Map();

// --- 탭 정의
const tabs = [
  { key: "all", label: "전체" },
  { key: "assigned", label: "배정순" },
  { key: "pickup", label: "픽업" },
  { key: "delivering", label: "배송" },
  { key: "completed", label: "완료" },
];
const currentFilter = ref("all");

const setFilter = (key) => {
  currentFilter.value = key;
};

// 배송 목록 더미 데이터
const deliveryList = ref([
  {
    reservationNo: "20251027-0135",
    storeName: "따끈따끈 베이커리",
    customerName: "김빵장",
    phone: "010-1234-5678",
    storage: "빵장고 [반월당역점]",
    status: "pickup",
    originalIndex: 0,
  },
  {
    reservationNo: "20251027-0136",
    storeName: "공주당",
    customerName: "이빵순",
    phone: "010-2345-6789",
    storage: "빵장고 [동대구역점]",
    status: "delivering",
    originalIndex: 1,
  },
  {
    reservationNo: "20251027-0137",
    storeName: "소베",
    customerName: "박빵돌",
    phone: "010-3456-7890",
    storage: "빵장고 [반월당역점]",
    status: "completed",
    originalIndex: 2,
  },
  {
    reservationNo: "20251027-0138",
    storeName: "네쥬",
    customerName: "최빵희",
    phone: "010-4567-8901",
    storage: "빵장고 [반월당역점]",
    status: "pickup",
    originalIndex: 3,
  },
  {
    reservationNo: "20251027-0139",
    storeName: "윈드윈",
    customerName: "정빵식",
    phone: "010-5678-9012",
    storage: "빵장고 [경대병원역점]",
    status: "pickup",
    originalIndex: 4,
  },
]);

const statusText = computed(() => {
  const statusMap = {
    pickup: "픽업 대기중",
    delivering: "배송 중",
    completed: "배송 완료",
  };
  return statusMap[deliveryStatus.value];
});

// ✅ 수정: 진행 중 상태 텍스트 추가
const getStatusText = (status, isBuffering = false) => {
  if (isBuffering) {
    if (status === "pickup") return "픽업 진행중...";
    if (status === "delivering") return "배송 진행중...";
  }
  
  const statusMap = {
    pickup: "픽업 대기중",
    delivering: "배송 중",
    completed: "배송 완료",
  };
  return statusMap[status];
};

// ✅ 수정: 진행 중 상태 색상 추가
const getStatusClass = (status, isBuffering = false) => {
  if (isBuffering) {
    if (status === "pickup") return "bg-[#D88A60]"; // 픽업→배송 중간 톤
    if (status === "delivering") return "bg-[#4DB8CA]"; // 배송→완료 중간 톤
  }
  
  const statusClass = {
    pickup: "bg-[#E67E50]",
    delivering: "bg-[#00ADD8]",
    completed: "bg-gray-400",
  };
  return statusClass[status];
};

const completedCount = computed(() => deliveryList.value.filter((d) => d.status === "completed").length);
const totalCount = computed(() => deliveryList.value.length);
const progressPercent = computed(() => (totalCount.value === 0 ? 0 : (completedCount.value / totalCount.value) * 100));
const remainingCount = computed(() => deliveryList.value.filter((d) => d.status !== "completed").length);

const sortedDeliveryList = computed(() => {
  const statusOrder = { pickup: 0, delivering: 1, completed: 2 };
  return [...deliveryList.value].sort((a, b) => {
    return statusOrder[a.status] - statusOrder[b.status] || a.originalIndex - b.originalIndex;
  });
});

const filteredDeliveryList = computed(() => {
  if (currentFilter.value === "all") return sortedDeliveryList.value;
  if (currentFilter.value === "assigned")
    return [...deliveryList.value].sort((a, b) => a.originalIndex - b.originalIndex);
  return sortedDeliveryList.value.filter((d) => d.status === currentFilter.value);
});

const shiftingSet = ref(new Set());
const bufferingSet = ref(new Set());

const clickStatusChange = (delivery) => {
  if (delivery.status === "completed") return;

  // 1단계: 버퍼링 상태 추가 (제자리에서 투명도만 변경)
  bufferingSet.value.add(delivery.reservationNo);

  // 2초 후
  setTimeout(() => {
    // 2단계: 버퍼링 해제하고 슬라이드 애니메이션 시작
    bufferingSet.value.delete(delivery.reservationNo);
    shiftingSet.value.add(delivery.reservationNo);

    // 슬라이드 애니메이션 시간(600ms) 후 상태 변경
    setTimeout(() => {
      if (delivery.status === "pickup") delivery.status = "delivering";
      else if (delivery.status === "delivering") delivery.status = "completed";

      updateMarkerImageByReservation(delivery.reservationNo);
      shiftingSet.value.delete(delivery.reservationNo);
    }, 600);
  }, 2000);
};

const cancelFromList = (delivery) => {
  if (!confirm("정말 이 배송을 취소하시겠습니까? (지도상의 마커도 제거됩니다)")) return;
  removeMarkerAndDelivery(delivery.reservationNo);
};

// ✅ 수정: 마커 선택 시 이미지 업데이트 추가
const selectMarkerWithBuffer = (info, markerInstance) => {
  // 이전에 선택된 마커가 있으면 원래 이미지로 복원
  if (selectedMarkerInstance.value && selectedMarkerInstance.value !== markerInstance) {
    updateMarkerImageByReservation(selectedMarkerInstance.value.reservationNo);
  }

  selectedMarkerLoading.value = true;
  clearTimeout(selectionTimeout);

  selectionTimeout = setTimeout(() => {
    selectedMarkerLoading.value = false;
    const delivery = deliveryList.value.find((d) => d.reservationNo === info.reservationNo);
    selectedMarker.value = {
      ...info,
      customerName: delivery?.customerName || "",
      phone: delivery?.phone || "",
      storage: delivery?.storage || "",
    };
    selectedMarkerInstance.value = markerInstance;
    showPanel.value = true;
    deliveryStatus.value = delivery ? delivery.status : "pickup";

    // ✅ 추가: 선택된 마커 이미지 변경
    updateMarkerImageByReservation(info.reservationNo, true);

    if (map && markerInstance) {
      const markerPosition = markerInstance.getPosition();
      
      // 먼저 마커로 이동
      map.setCenter(markerPosition);
      
      // 그 다음 패널 높이만큼 지도를 위로 팬 (픽셀 단위)
      // 패널이 420px이므로 약 210px 정도 아래로 팬
      map.panBy(0, 210);
    }
  }, 300);
};

const removeMarkerAndDelivery = (reservationNo) => {
  const idx = markers.findIndex((m) => m.reservationNo === reservationNo);
  if (idx !== -1) {
    const marker = markers[idx];
    marker.setMap(null);
    markers.splice(idx, 1);
    markerOriginalImages.delete(reservationNo);
  }

  const listIdx = deliveryList.value.findIndex((d) => d.reservationNo === reservationNo);
  if (listIdx !== -1) {
    deliveryList.value.splice(listIdx, 1);
  }

  showPanel.value = false;
  selectedMarker.value = null;
  selectedMarkerInstance.value = null;
};

const handleCancel = () => {
  if (!confirm("정말 배송을 취소하시겠습니까? (지도와 목록 모두에서 제거됩니다)")) return;
  if (!selectedMarker.value) return;
  removeMarkerAndDelivery(selectedMarker.value.reservationNo);
};

const handlePickupComplete = () => {
  deliveryStatus.value = "delivering";
  const delivery = deliveryList.value.find((d) => d.reservationNo === selectedMarker.value?.reservationNo);
  if (delivery) {
    delivery.status = "delivering";
    updateMarkerImageByReservation(delivery.reservationNo, true);
  }
};

const handleDeliveryComplete = () => {
  deliveryStatus.value = "completed";
  const delivery = deliveryList.value.find((d) => d.reservationNo === selectedMarker.value?.reservationNo);
  if (delivery) {
    delivery.status = "completed";
    updateMarkerImageByReservation(delivery.reservationNo, true);
  }

  setTimeout(() => {
    handleClose();
  }, 2000);
};

// ✅ 수정: 패널 닫을 때 마커 이미지 복원
const handleClose = () => {
  if (selectedMarkerInstance.value) {
    updateMarkerImageByReservation(selectedMarkerInstance.value.reservationNo);
  }
  
  showPanel.value = false;
  deliveryStatus.value = "pickup";
  selectedMarker.value = null;
  selectedMarkerInstance.value = null;
};

const workToggle = () => {
  showDeliveryList.value = !showDeliveryList.value;
  if (showDeliveryList.value) {
    showPanel.value = false;
    // 지도 → 리스트 전환 시 선택된 마커 이미지 복원
    if (selectedMarkerInstance.value) {
      updateMarkerImageByReservation(selectedMarkerInstance.value.reservationNo);
      selectedMarkerInstance.value = null;
    }
  } else {
    nextTick(() => {
      if (!map) {
        initMap();
      }
    });
  }
};

// ✅ 추가: 완료 마커 이미지 매핑 (각 마커별 완료 이미지)
const getCompleteImageByIndex = (index) => {
  const completeImages = [
    "/images/kms/complete_pin (1).png",
    "/images/kms/complete_pin (2).png",
    "/images/kms/complete_pin (3).png",
    "/images/kms/complete_pin (4).png",
    "/images/kms/complete_pin (5).png",
  ];
  return completeImages[index] || completeImages[0];
};

// 🔧 지도 초기화 함수
const initMap = () => {
  if (!window.kakao || !window.kakao.maps) return;
  window.kakao.maps.load(() => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    const mapOption = {
      center: new kakao.maps.LatLng(35.868508, 128.593771),
      level: 3,
    };

    map = new kakao.maps.Map(mapContainer, mapOption);

    const positions = [
      {
        title: "따끈따끈 베이커리",
        latlng: new kakao.maps.LatLng(35.868508, 128.593771),
        reservationNo: "20251027-0135",
        imageSrc: "/images/pje/deliver_pin1.png",
        imageSize: { width: 44, height: 63 },
        index: 0,
      },
      {
        title: "공주당",
        latlng: new kakao.maps.LatLng(35.868006, 128.595659),
        reservationNo: "20251027-0136",
        imageSrc: "/images/pje/deliver_pin2.png",
        imageSize: { width: 44, height: 63 },
        index: 1,
      },
      {
        title: "소베",
        latlng: new kakao.maps.LatLng(35.869458, 128.593245),
        reservationNo: "20251027-0137",
        imageSrc: "/images/pje/deliver_pin3.png",
        imageSize: { width: 44, height: 63 },
        index: 2,
      },
      {
        title: "네쥬",
        latlng: new kakao.maps.LatLng(35.868691, 128.594742),
        reservationNo: "20251027-0138",
        imageSrc: "/images/pje/deliver_pin4.png",
        imageSize: { width: 44, height: 63 },
        index: 3,
      },
      {
        title: "윈드윈",
        latlng: new kakao.maps.LatLng(35.867354, 128.584411),
        reservationNo: "20251027-0139",
        imageSrc: "/images/pje/deliver_pin5.png",
        imageSize: { width: 44, height: 63 },
        index: 4,
      },
    ];

    markers = [];
    positions.forEach((info) => {
      const markerImageSrc = info.imageSrc;
      const markerImageSize = new kakao.maps.Size(info.imageSize.width, info.imageSize.height);
      const markerImage = new kakao.maps.MarkerImage(markerImageSrc, markerImageSize);

      const marker = new kakao.maps.Marker({
        map: map,
        position: info.latlng,
        title: info.title,
        image: markerImage,
      });

      marker.reservationNo = info.reservationNo;
      marker.markerIndex = info.index;

      // ✅ 추가: 원본 이미지 정보 저장
      markerOriginalImages.set(info.reservationNo, {
        normalSrc: info.imageSrc,
        completeSrc: getCompleteImageByIndex(info.index),
        imageSize: info.imageSize,
      });

      const deliveryInfo = deliveryList.value.find(
        (d) => d.storeName === info.title || d.reservationNo === info.reservationNo
      );
      
      // ✅ 수정: 완료 상태면 complete 이미지로 설정
      if (deliveryInfo && deliveryInfo.status === "completed") {
        const completeImageSrc = getCompleteImageByIndex(info.index);
        const completeImage = new kakao.maps.MarkerImage(
          completeImageSrc,
          new kakao.maps.Size(info.imageSize.width, info.imageSize.height)
        );
        marker.setImage(completeImage);
      }

      kakao.maps.event.addListener(marker, "click", function () {
        selectMarkerWithBuffer(info, marker);
      });

      markers.push(marker);
    });

    fitBoundsToMarkers();
  });
};

const fitBoundsToMarkers = () => {
  if (!map || markers.length === 0) return;
  const bounds = new kakao.maps.LatLngBounds();
  markers.forEach((marker) => {
    bounds.extend(marker.getPosition());
  });
  map.setBounds(bounds);
};

// ✅ 핵심 수정: 마커 이미지 동적 변경 함수
const updateMarkerImageByReservation = (reservationNo, isSelected = false) => {
  const marker = markers.find((m) => m.reservationNo === reservationNo);
  const delivery = deliveryList.value.find((d) => d.reservationNo === reservationNo);
  
  if (!marker || !delivery) return;
  
  const imageInfo = markerOriginalImages.get(reservationNo);
  if (!imageInfo) return;
  
  let imageSrc;
  
  // 선택 여부와 완료 상태에 따라 이미지 결정
  if (isSelected) {
    // 선택된 상태
    if (delivery.status === "completed") {
      imageSrc = "/images/kms/select_complete_pin.png";
    } else {
      imageSrc = "/images/kms/select_pin.png";
    }
  } else {
    // 선택되지 않은 상태
    if (delivery.status === "completed") {
      imageSrc = imageInfo.completeSrc;
    } else {
      imageSrc = imageInfo.normalSrc;
    }
  }
  
  const newImage = new kakao.maps.MarkerImage(
    imageSrc,
    new kakao.maps.Size(imageInfo.imageSize.width, imageInfo.imageSize.height)
  );
  
  marker.setImage(newImage);
};

const formatTelHref = (phone) => {
  return phone.replace(/\D/g, "");
};

// route.query.view 변화 감지
watch(
  () => route.query.view,
  async (newView) => {
    if (newView === "list") {
      showDeliveryList.value = true;
      showPanel.value = false;
    } else {
      // map이거나 query가 없으면 지도 화면
      showDeliveryList.value = false;
      await nextTick();
      if (!map) {
        initMap();
      }
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.slide-up-enter-active {
  transition: transform 0.3s ease-out;
}
.slide-up-leave-active {
  transition: transform 0.3s ease-in;
}
.slide-up-enter-from {
  transform: translateY(100%);
}
.slide-up-leave-to {
  transform: translateY(100%);
}

.list-move {
  transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* 버퍼링 상태: 제자리에서 투명도만 변경 */
.buffering {
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

/* 슬라이드 아웃: 완전히 왼쪽 밖으로 빠져나감 */
.slide-out-left {
  transform: translateX(+120%);
  opacity: 0;
  transition: transform 0.6s ease, opacity 0.6s ease;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
