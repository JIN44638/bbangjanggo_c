<template>
  <div class="w-full max-w-[768px] mx-auto h-full overflow-y-scroll overflow-x-hidden pb-[20px]">
    <!-- Font Awesome CDN 추가 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

    <!-- 알림 -->
    <div class="flex gap-2 items-center rounded-md bg-gray-100 p-3 mx-4 md:mx-[20px] my-4 md:my-[20px]">
      <i class="fa-solid fa-bullhorn text-red-600"></i>
      <!-- 알림 스와이퍼 -->
      <div>
        <Swiper
          :direction="'vertical'"
          :loop="true"
          :autoplay="{ delay: 2500, disableOnInteraction: false }"
          :modules="modules"
          class="h-5 overflow-hidden"
        >
          <SwiperSlide
            v-for="(n, i) in noticeList"
            :key="i"
            class="flex max-w-[310px] items-center justify-center text-[14px] font-[SpokaHanSansNeo] overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {{ n.message }}
          </SwiperSlide>
        </Swiper>
      </div>
    </div>

    <!-- 탭 메뉴 -->
    <div class="rounded-lg border border-[#50311D] mb-5 mx-4 md:mx-[20px]">
      <div class="flex justify-between text-center relative z-10">
        <!-- 대기 탭 -->
        <p
          class="rounded-l-sm font-[SpokaHanSansNeo] text-4 w-[50%] leading-[40px] cursor-pointer transition-colors duration-300"
          :class="activeTab === 'waiting' ? 'bg-[#50311D] text-white' : 'text-[#50311D]'"
          @click="activeTab = 'waiting'"
        >
          대기
        </p>

        <!-- 진행 탭 -->
        <p
          class="rounded-r-sm font-[SpokaHanSansNeo] text-4 w-[50%] leading-[40px] cursor-pointer transition-colors duration-300"
          :class="activeTab === 'progress' ? 'bg-[#50311D] text-white' : 'text-[#50311D]'"
          @click="activeTab = 'progress'"
        >
          진행
        </p>
      </div>
    </div>

    <!-- 대기 탭 -->
    <div v-show="activeTab === 'waiting'" class="mx-4 md:mx-[20px]">
      <div v-if="waitingList.length > 0">
        <transition-group name="slide" tag="div">
          <div v-for="(info, index) in waitingList" :key="info.id" class="mb-4 overflow-hidden relative">
            <!-- 오버레이 -->
            <div
              v-if="overlayItems[index]"
              class="absolute inset-0 bg-white/40 rounded-lg z-10 pointer-events-none"
            ></div>

            <!-- 지도 -->
            <div :id="'map-waiting-' + index" class="w-full h-[250px] rounded-t-lg"></div>
            <!-- 배송 정보 -->
            <div class="bg-[#C89968] text-white p-4 rounded-b-lg flex justify-between items-center">
              <div>
                <p class="text-xs font-[SpokaHanSansNeo]">{{ formatDate(info.date) }} {{ info.time }}</p>
                <!-- 모바일 전용 -->
                <p class="text-sm font-[SpokaHanSansNeo] mt-1 mb-2 sm:hidden">
                  <span class="block">{{ info.pickUp }}</span>
                  <span class="block mt-1">{{ info.deliver }}</span>
                </p>

                <!-- PC용 -->
                <p class="text-sm font-[SpokaHanSansNeo] mt-1 mb-2 hidden sm:block">
                  {{ info.pickUp }} · · · · · {{ info.deliver }}
                </p>
                <p class="text-sm font-[SpokaHanSansNeo]">
                  (금액) <span class="text-2xl font-bold">{{ info.price }}</span>
                </p>
              </div>
              <button
                @click.stop="assignDelivery(index)"
                :disabled="overlayItems[index]"
                class="bg-white text-[#50311D] w-[100px] h-[80px] px-4 py-1 rounded-md text-lg font-[SpokaHanSansNeo] font-bold transition-all duration-300"
                :class="{
                  'cursor-not-allowed opacity-50': overlayItems[index],
                  'cursor-pointer': !overlayItems[index],
                }"
              >
                {{ overlayItems[index] ? "배정 중" : "배정" }}
              </button>
            </div>
          </div>
        </transition-group>
      </div>
      <div v-else class="w-full h-[690px] flex flex-col justify-center items-center">
        <i class="text-[30px] text-gray-300 fa-solid fa-truck"></i>
        <p class="text-gray-300 font-[SpokaHanSansNeo] py-2">새로운 배정 목록이 없습니다.</p>
      </div>
    </div>

    <!-- 진행 탭 -->
    <div v-show="activeTab === 'progress'" class="mx-4 md:mx-[20px]">
      <div v-if="progressList.length > 0" class="space-y-4">
        <div v-for="(info, index) in progressList" :key="'progress-' + info.id" class="cursor-pointer">
          <!-- 지도 -->
          <div :id="'map-progress-' + index" class="w-full h-[250px] rounded-t-lg"></div>
          <!-- 배송 정보 -->
          <div class="bg-[#C89968] text-white p-4 rounded-b-lg flex justify-between items-center">
            <div>
              <p class="text-xs font-[SpokaHanSansNeo]">{{ formatDate(info.date) }} {{ info.time }}</p>
              <p class="text-sm font-[SpokaHanSansNeo] mt-1 mb-2">{{ info.pickUp }} · · · · · {{ info.deliver }}</p>
              <p class="text-sm font-[SpokaHanSansNeo]">
                (금액) <span class="text-2xl font-bold">{{ info.price }}</span>
              </p>
            </div>
            <button
              class="bg-white text-[#50311D] whitespace-nowrap w-[100px] h-[80px] px-4 py-1 rounded-md text-lg font-[SpokaHanSansNeo] font-bold cursor-default"
            >
              배정 완료
            </button>
          </div>
        </div>
      </div>
      <div v-else class="w-full h-[690px] flex flex-col justify-center items-center">
        <i class="text-[30px] text-gray-300 fa-solid fa-truck"></i>
        <p class="text-gray-300 font-[SpokaHanSansNeo] py-2">진행 중인 목록이 없습니다.</p>
      </div>
    </div>

    <!-- 배정 완료 모달 -->
    <transition name="modal-fade">
      <div v-if="showModal" class="fixed inset-0 z-[9999] flex items-center justify-center">
        <!-- 오버레이 -->
        <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>

        <!-- 모달 콘텐츠 -->
        <div class="relative bg-white rounded-2xl w-[90%] max-w-[450px] mx-[20px] shadow-2xl transform transition-all">
          <!-- 아이콘 -->
          <div class="flex justify-center pt-8 pb-4">
            <div class="w-[50px] h-[50px] bg-[#50311D] rounded-full flex items-center justify-center">
              <i class="fa-solid fa-check text-white text-2xl"></i>
            </div>
          </div>

          <!-- 메시지 -->
          <div class="px-8 pb-6 text-center">
            <h3 class="text-2xl font-[Cafe24Surround] text-[#50311D] mb-3">배정이 완료되었습니다!</h3>
            <p class="text-gray-500 font-[SpokaHanSansNeo] text-[16px] leading-relaxed">
              완료된 목록은 [진행탭]에서 확인해주세요!
            </p>
          </div>

          <!-- 닫기 버튼 -->
          <div class="px-4 pb-4">
            <button
              @click="closeModal"
              class="w-full h-[50px] bg-[#50311D] text-white rounded-xl text-[16px] font-[SpokaHanSansNeo] cursor-pointer transition-colors active:scale-[0.98]"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import notices from "@/data/notice.json";

const route = useRoute();
const router = useRouter();
const modules = [Autoplay];
const noticeList = ref(notices);

const activeTab = ref("waiting");
const showModal = ref(false);

// 배송 정보 데이터
const allDeliveryInfo = [
  {
    id: 1,
    date: new Date(),
    time: "11:48",
    pickUp: "대구 중구 중앙대로 395 1F",
    deliver: "대구 중구 달구벌대로 2100",
    price: "5,400원",
    pickUpLatLng: { lat: 35.868357343, lng: 128.593475548 },
    deliverLatLng: { lat: 35.864344654, lng: 128.593335108 },
  },
  {
    id: 2,
    date: new Date(),
    time: "11:52",
    pickUp: "대구 중구 중앙대로79길 6 1층",
    deliver: "대구 중구 달구벌대로 2190",
    price: "5,400원",
    pickUpLatLng: { lat: 35.869310354, lng: 128.593244905 },
    deliverLatLng: { lat: 35.863266486, lng: 128.602562449 },
  },
  {
    id: 3,
    date: new Date(),
    time: "12:01",
    pickUp: "대구 달서구 성서로 420 1층",
    deliver: "대구 서구 와룡로 527",
    price: "5,400원",
    pickUpLatLng: { lat: 35.854942873, lng: 128.507705037 },
    deliverLatLng: { lat: 35.881483641, lng: 128.540176277 },
  },
  {
    id: 4,
    date: new Date(),
    time: "12:15",
    pickUp: "대구 중구 동성로 6-2",
    deliver: "대구 중구 달구벌대로 2100",
    price: "5,400원",
    pickUpLatLng: { lat: 35.867484125, lng: 128.594372877 },
    deliverLatLng: { lat: 35.864344654, lng: 128.593335108 },
  },
  {
    id: 5,
    date: new Date(),
    time: "13:20",
    pickUp: "대구 수성구 화랑로8길 11-11 1층",
    deliver: "대구 동구 동대구로 550",
    price: "5,400원",
    pickUpLatLng: { lat: 35.870394181, lng: 128.633762538 },
    deliverLatLng: { lat: 35.879494199, lng: 128.628741351 },
  },
];

const waitingList = ref([...allDeliveryInfo]);
const progressList = ref([]);

const overlayItems = ref({});
const animatingItems = ref({});

const waitingMaps = ref([]);
const progressMaps = ref([]);

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// activeTab 변경 감지
watch(activeTab, async (newTab) => {
  await nextTick();
  await nextTick(); // 추가 nextTick으로 확실히 DOM 렌더링 완료

  if (newTab === "progress" && progressList.value.length > 0) {
    initProgressMaps();
  } else if (newTab === "waiting" && waitingList.value.length > 0) {
    initWaitingMaps();
  }
});

const assignDelivery = (index) => {
  // 1단계: 버튼 텍스트 변경 (배정 중)
  overlayItems.value[index] = true;
  animatingItems.value[index] = true;

  // 2단계: 슬라이드 애니메이션 후 목록 이동
  setTimeout(async () => {
    const item = waitingList.value[index];
    progressList.value.push(item);
    waitingList.value.splice(index, 1);

    delete overlayItems.value[index];
    delete animatingItems.value[index];

    // ✅ nextTick을 두 번 사용하여 DOM 업데이트 보장
    await nextTick();
    await nextTick();

    // 진행 탭의 지도 초기화
    initProgressMaps();

    // 3단계: 모달 표시
    showModal.value = true;
  }, 600);
};

const closeModal = () => {
  showModal.value = false;
};

// 지도 초기화
const initWaitingMaps = () => {
  if (!window.kakao || !window.kakao.maps) return;
  waitingMaps.value = [];
  waitingList.value.forEach((info, index) => {
    const mapContainer = document.getElementById(`map-waiting-${index}`);
    if (!mapContainer) return;
    const centerLat = (info.pickUpLatLng.lat + info.deliverLatLng.lat) / 2;
    const centerLng = (info.pickUpLatLng.lng + info.deliverLatLng.lng) / 2;
    const map = new kakao.maps.Map(mapContainer, { center: new kakao.maps.LatLng(centerLat, centerLng), level: 5 });
    waitingMaps.value.push(map);

    const pickUpMarker = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(info.pickUpLatLng.lat, info.pickUpLatLng.lng),
      title: info.pickUp,
      image: new kakao.maps.MarkerImage("/images/pje/pickup.png", new kakao.maps.Size(33, 47)),
    });
    const deliverMarker = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(info.deliverLatLng.lat, info.deliverLatLng.lng),
      title: info.deliver,
      image: new kakao.maps.MarkerImage("/images/pje/deliver.png", new kakao.maps.Size(33, 47)),
    });

    const pickUpInfo = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;font-family:SpokaHanSansNeo;">${info.pickUp}</div>`,
    });
    const deliverInfo = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;font-family:SpokaHanSansNeo;">${info.deliver}</div>`,
    });

    kakao.maps.event.addListener(pickUpMarker, "click", () => {
      pickUpInfo.open(map, pickUpMarker);
      setTimeout(() => pickUpInfo.close(), 2000);
    });
    kakao.maps.event.addListener(deliverMarker, "click", () => {
      deliverInfo.open(map, deliverMarker);
      setTimeout(() => deliverInfo.close(), 2000);
    });

    const bounds = new kakao.maps.LatLngBounds();
    bounds.extend(new kakao.maps.LatLng(info.pickUpLatLng.lat, info.pickUpLatLng.lng));
    bounds.extend(new kakao.maps.LatLng(info.deliverLatLng.lat, info.deliverLatLng.lng));
    map.setBounds(bounds, 50, 50, 50, 50);
  });
};

const initProgressMaps = () => {
  if (!window.kakao || !window.kakao.maps) return;
  progressMaps.value = [];
  progressList.value.forEach((info, index) => {
    const mapContainer = document.getElementById(`map-progress-${index}`);
    if (!mapContainer) return;
    const centerLat = (info.pickUpLatLng.lat + info.deliverLatLng.lat) / 2;
    const centerLng = (info.pickUpLatLng.lng + info.deliverLatLng.lng) / 2;
    const map = new kakao.maps.Map(mapContainer, { center: new kakao.maps.LatLng(centerLat, centerLng), level: 5 });
    progressMaps.value.push(map);

    const pickUpMarker = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(info.pickUpLatLng.lat, info.pickUpLatLng.lng),
      title: info.pickUp,
      image: new kakao.maps.MarkerImage("/images/pje/pickup.png", new kakao.maps.Size(33, 47)),
    });
    const deliverMarker = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(info.deliverLatLng.lat, info.deliverLatLng.lng),
      title: info.deliver,
      image: new kakao.maps.MarkerImage("/images/pje/deliver.png", new kakao.maps.Size(33, 47)),
    });

    const pickUpInfo = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;font-family:SpokaHanSansNeo;">${info.pickUp}</div>`,
    });
    const deliverInfo = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;font-size:12px;font-family:SpokaHanSansNeo;">${info.deliver}</div>`,
    });

    kakao.maps.event.addListener(pickUpMarker, "click", () => {
      pickUpInfo.open(map, pickUpMarker);
      setTimeout(() => pickUpInfo.close(), 2000);
    });
    kakao.maps.event.addListener(deliverMarker, "click", () => {
      deliverInfo.open(map, deliverMarker);
      setTimeout(() => deliverInfo.close(), 2000);
    });

    const bounds = new kakao.maps.LatLngBounds();
    bounds.extend(new kakao.maps.LatLng(info.pickUpLatLng.lat, info.pickUpLatLng.lng));
    bounds.extend(new kakao.maps.LatLng(info.deliverLatLng.lat, info.deliverLatLng.lng));
    map.setBounds(bounds, 50, 50, 50, 50);
  });
};

onMounted(() => {
  activeTab.value = route.query.tab || "waiting";

  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(() => {
      if (activeTab.value === "progress") {
        initProgressMaps();
      } else {
        initWaitingMaps();
      }
    });
  }
});

watch(
  () => route.query.tab,
  async (newTab) => {
    activeTab.value = newTab || "waiting";
    await nextTick();
    if (activeTab.value === "progress") initProgressMaps();
    else initWaitingMaps();
  }
);
</script>

<style scoped>
/* 좌➡우 슬라이드 애니메이션 */
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.6s ease, opacity 0.6s ease;
}

/* 리스트 위치 이동 부드럽게 */
.slide-move {
  transition: transform 0.5s ease;
}

/* 모달 페이드 애니메이션 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from .relative {
  transform: scale(0.9);
  opacity: 0;
}

.modal-fade-leave-to .relative {
  transform: scale(0.9);
  opacity: 0;
}
</style>
