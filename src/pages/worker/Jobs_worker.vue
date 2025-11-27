<template>
  <div class="w-full max-w-[768px] mx-auto font-[SpokaHanSansNeo] font-normal relative" style="height: 100vh">
    <!-- 배송 목록 화면 -->
    <div v-show="showDeliveryList" class="w-full h-full bg-white overflow-y-auto pb-25">
      <div>
        <!-- 상단 고정 (진행 정보 + 탭) -->
        <div class="h-[120px] w-full max-w-[750px] fixed bg-white z-999 pl-[25px] pt-2">
          <div class="w-full max-w-[600px] flex flex-col gap-2">
            <!-- 진행 문구 -->
            <div class="flex place-content-between items-center mt-4">
              <p class="text-xl">{{ remainingCount }}건만 더 하면 배달 완료! 힘내세요!</p>
              <span>{{ remainingCount }}/{{ totalCount }}</span>
            </div>

            <!-- 프로그레스바 -->
            <div class="w-full mb-2 mt-2">
              <div class="w-full h-3 bg-gray-200 rounded-full">
                <div
                  class="h-full bg-[#50311D] rounded-full transition-all duration-500 ease-out"
                  :style="{ width: progressPercent + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 탭 필터 (전체 / 배정순 / 픽업 / 배송 / 완료) -->
          <div class="flex gap-2 items-center mt-2">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="setFilter(tab.key)"
              :class="[
                'px-3 py-1 rounded-md text-sm',
                currentFilter === tab.key ? 'bg-[#50311D] text-white' : 'bg-gray-100 text-gray-700',
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- 배송 카드들 (transition-group: reorder 애니메이션) -->
        <div class="space-y-4 pt-[140px] px-6">
          <transition-group name="list" tag="div">
            <div
              v-for="delivery in filteredDeliveryList"
              :key="delivery.reservationNo"
              class="rounded-lg transition-opacity duration-300 shadow-md relative overflow-hidden mb-5"
              :class="[
                'bg-white',
                delivery.status === 'completed' ? 'opacity-60' : '',
                bufferingSet.has(delivery.reservationNo) ? 'buffering' : '',
                shiftingSet.has(delivery.reservationNo) ? 'slide-out-left' : '',
              ]"
            >
              <!-- 배송카드 상단 예약정보 및 손님정보 -->
              <div
                class="flex justify-between items-start p-5 rounded-t-lg"
                :class="delivery.status === 'completed' ? 'bg-gray-300' : 'bg-[#ba8e5f]'"
              >
                <p class="text-sm text-gray-50">예약 번호: {{ delivery.reservationNo }}</p>
                <p class="text-sm text-gray-50">{{ delivery.customerName }} · {{ delivery.phone }}</p>
              </div>

              <div class="flex justify-between items-end p-5">
                <!-- 픽업장소 및 배달장소 -->
                <div class="flex flex-col items-start gap-[15px]">
                  <div class="flex">
                    <div class="relative bg-[#ba8e5f] w-[40px] h-[40px] rounded-4xl mr-4">
                      <p
                        class="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] whitespace-nowrap text-[13px] text-white font-[SpokaHanSansNeo]"
                      >
                        픽업
                      </p>
                    </div>
                    <p class="text-base my-2">{{ delivery.storeName }}</p>
                  </div>
                  <div class="flex">
                    <div class="relative bg-[#50311d] w-[40px] h-[40px] rounded-4xl mr-4">
                      <p
                        class="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] whitespace-nowrap text-[13px] text-white font-[SpokaHanSansNeo]"
                      >
                        배달
                      </p>
                    </div>
                    <p class="text-base my-2">보관지점: {{ delivery.storage }}</p>
                  </div>
                </div>

                <!-- 배달리스트 상태 버튼 -->
                <div class="text-sm text-gray-600 space-y-1 flex flex-col items-end gap-[35px]">
                  <!-- 간단한 취소 버튼 (리스트에서도 취소 가능) -->
                  <button @click="cancelFromList(delivery)" class="mt-1 text-xs text-gray-500 underline">주문취소하기</button>
                  
                  <button
                    @click="clickStatusChange(delivery)"
                    :disabled="delivery.status === 'completed'"
                    class="px-4 py-2 text-white text-sm rounded transition-all duration-300"
                    :class="[
                      getStatusClass(delivery.status),
                      delivery.status === 'completed'
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer hover:opacity-80 active:scale-95',
                    ]"
                  >
                    {{ getStatusText(delivery.status) }}
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
          class="w-full h-[400px] bg-white absolute bottom-0 left-0 z-999 text-center rounded-t-[1vw] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]"
        >
          <div class="w-full flex flex-row-reverse pt-[25px] pb-[15px] px-[50px]">
            <i @click="handleClose" class="fa-solid fa-x text-gray-500 cursor-pointer"></i>
          </div>

          <!-- 로딩/버퍼 표시 (마커 전환 시) -->
          <div v-if="selectedMarkerLoading" class="py-4">
            <div class="inline-flex items-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" class="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
              </svg>
              <span>로딩 중...</span>
            </div>
          </div>

          <div v-else class="flex place-content-between mt-[15px] mx-[50px]">
            <div class="flex flex-col gap-4 text-start">
              <div class="flex">
                <p class="text-gray-400 text-[16px] w-[120px] font">예약번호</p>
                <span class="text-gray-800 text-base">{{ selectedMarker?.reservationNo || "—" }}</span>
              </div>
              <div class="flex">
                <p class="text-gray-400 text-base w-[120px]">이름</p>
                <span class="text-gray-800 text-base">{{ selectedMarker?.customerName || "—" }}</span>
              </div>
              <div class="flex items-center">
                <p class="text-gray-400 text-base w-[120px]">전화번호</p>
                <!-- tel: 링크 적용 (클릭하면 전화) -->
                <a
                  v-if="selectedMarker?.phone"
                  :href="'tel:' + formatTelHref(selectedMarker.phone)"
                  class="text-gray-800 text-base underline"
                >
                <i class="fa-solid fa-phone text-gray-500 text-sm"></i>
                  {{  selectedMarker.phone }}
                </a>
                <span v-else class="text-gray-800 text-base">—</span>
              </div>
            </div>

            <div class="flex flex-col gap-4 text-start">
              <div class="flex">
                <p class="text-gray-400 text-base w-[120px]">픽업지점</p>
                <span class="text-gray-800 text-base">{{ selectedMarker?.title || "—" }}</span>
              </div>
              <div class="flex">
                <p class="text-gray-400 text-base w-[120px]">보관지점</p>
                <span class="text-gray-800 text-base">{{ selectedMarker?.storage || "—" }}</span>
              </div>
              <div class="flex">
                <p class="text-gray-400 text-base w-[120px]">상태</p>
                <span
                  class="text-base font-semibold"
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
            class="underline text-sm text-gray-700 mt-[30px] cursor-pointer hover:text-gray-900"
          >
            배송 취소하기
          </button>

          <div class="mt-[30px]">
            <button
              v-if="deliveryStatus === 'pickup'"
              @click="handlePickupComplete"
              class="w-[700px] h-[60px] bg-[#E67E50] text-white rounded-md cursor-pointer hover:bg-[#D66940] transition-colors"
            >
              픽업 완료
            </button>

            <button
              v-else-if="deliveryStatus === 'delivering'"
              @click="handleDeliveryComplete"
              class="w-[700px] h-[60px] bg-[#00ADD8] text-white rounded-md cursor-pointer hover:bg-[#15A4C8] transition-colors"
            >
              배송 완료
            </button>

            <button
              v-else-if="deliveryStatus === 'completed'"
              @click="handleClose"
              class="w-[700px] h-[60px] bg-gray-400 text-white rounded-md cursor-not-allowed"
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
      class="w-[50px] h-[50px] bg-[#50311D] absolute top-[35px] right-[40px] rounded-full z-[999] transform translate-z-0 cursor-pointer"
    >
      <i
        :class="showDeliveryList ? 'fa-map' : 'fa-bars'"
        class="fa-solid absolute top-[50%] left-[50%] w-full -translate-x-[50%] -translate-y-[50%] text-white text-center text-2xl"
      ></i>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";

const showPanel = ref(false);
const selectedMarker = ref(null);
const selectedMarkerInstance = ref(null);
const selectedMarkerLoading = ref(false);
let selectionTimeout = null;

const deliveryStatus = ref("pickup");
const showDeliveryList = ref(false); // 🔧 지도부터 시작하도록 false로 변경
let map = null;
let markers = [];

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
    storage: "빵장고 [중앙로점]",
    status: "delivering",
    originalIndex: 1,
  },
  {
    reservationNo: "20251027-0137",
    storeName: "소베",
    customerName: "박빵돌",
    phone: "010-3456-7890",
    storage: "빵장고 [동성로점]",
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
    storage: "빵장고 [서문시장점]",
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

const getStatusText = (status) => {
  const statusMap = {
    pickup: "픽업 대기중",
    delivering: "배송 중",
    completed: "배송 완료",
  };
  return statusMap[status];
};

const getStatusClass = (status) => {
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

      updateMarkerOpacityByReservation(delivery.reservationNo);
      shiftingSet.value.delete(delivery.reservationNo);
    }, 600);
  }, 2000);
};

const cancelFromList = (delivery) => {
  if (!confirm("정말 이 배송을 취소하시겠습니까? (지도상의 마커도 제거됩니다)")) return;
  removeMarkerAndDelivery(delivery.reservationNo);
};

const selectMarkerWithBuffer = (info, markerInstance) => {
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

    if (map && markerInstance) {
      map.panTo(markerInstance.getPosition());
    }
  }, 300);
};

const removeMarkerAndDelivery = (reservationNo) => {
  const idx = markers.findIndex((m) => m.reservationNo === reservationNo);
  if (idx !== -1) {
    const marker = markers[idx];
    marker.setMap(null);
    markers.splice(idx, 1);
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
    updateMarkerOpacityByReservation(delivery.reservationNo);
  }
};

const handleDeliveryComplete = () => {
  deliveryStatus.value = "completed";
  const delivery = deliveryList.value.find((d) => d.reservationNo === selectedMarker.value?.reservationNo);
  if (delivery) {
    delivery.status = "completed";
    updateMarkerOpacityByReservation(delivery.reservationNo);
  }

  setTimeout(() => {
    handleClose();
  }, 2000);
};

const handleClose = () => {
  showPanel.value = false;
  deliveryStatus.value = "pickup";
  selectedMarker.value = null;
  selectedMarkerInstance.value = null;
};

const workToggle = () => {
  showDeliveryList.value = !showDeliveryList.value;
  if (showDeliveryList.value) {
    showPanel.value = false;
  } else {
    // 🔧 지도로 전환 시 지도가 없으면 초기화
    nextTick(() => {
      if (!map) {
        initMap();
      }
    });
  }
};

// 🔧 지도 초기화 함수
const initMap = () => {
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
        imageSrc: "/images/kms/mainpin.png",
        imageSize: { width: 44, height: 63 },
      },
      {
        title: "공주당",
        latlng: new kakao.maps.LatLng(35.868006, 128.595659),
        reservationNo: "20251027-0136",
        imageSrc: "/images/pje/deliver_pin1.png",
        imageSize: { width: 44, height: 63 },
      },
      {
        title: "소베",
        latlng: new kakao.maps.LatLng(35.869458, 128.593245),
        reservationNo: "20251027-0137",
        imageSrc: "/images/pje/deliver_pin2.png",
        imageSize: { width: 44, height: 63 },
      },
      {
        title: "네쥬",
        latlng: new kakao.maps.LatLng(35.868691, 128.594742),
        reservationNo: "20251027-0138",
        imageSrc: "/images/pje/deliver_pin3.png",
        imageSize: { width: 44, height: 63 },
      },
      {
        title: "윈드윈",
        latlng: new kakao.maps.LatLng(35.867354, 128.584411),
        reservationNo: "20251027-0139",
        imageSrc: "/images/pje/deliver_pin4.png",
        imageSize: { width: 44, height: 63 },
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

      const deliveryInfo = deliveryList.value.find(
        (d) => d.storeName === info.title || d.reservationNo === info.reservationNo
      );
      if (deliveryInfo && deliveryInfo.status === "completed") {
        marker.setOpacity(0.4);
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

const updateMarkerOpacityByReservation = (reservationNo) => {
  const marker = markers.find((m) => m.reservationNo === reservationNo);
  const delivery = deliveryList.value.find((d) => d.reservationNo === reservationNo);
  if (marker && delivery) {
    marker.setOpacity(delivery.status === "completed" ? 0.4 : 1);
  }
};

const formatTelHref = (phone) => {
  return phone.replace(/\D/g, "");
};

// 🔧 초기 마운트 시 지도 초기화
onMounted(() => {
  initMap();
});
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