<template>
  <div class="w-[768px] h-full overflow-y-scroll overflow-x-hidden pb-[20px]">
    <!-- Font Awesome CDN 추가 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

    <!-- 알림 -->
    <div class="flex gap-2 items-center rounded-md bg-gray-100 p-3 m-[20px]">
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
            class="flex items-center justify-center text-[14px] font-[SpokaHanSansNeo]"
          >
            {{ n.message }}
          </SwiperSlide>
        </Swiper>
      </div>
    </div>

    <!-- 탭 메뉴 -->
    <div class="rounded-lg border border-[#50311D] mb-5 mx-[20px]">
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
    <div v-show="activeTab === 'waiting'" class="mx-[20px]">
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
                <p class="text-sm font-[SpokaHanSansNeo] mt-1 mb-2">{{ info.pickUp }} · · · · · {{ info.deliver }}</p>
                <p class="text-sm font-[SpokaHanSansNeo]">
                  (금액) <span class="text-2xl font-bold">{{ info.price }}</span>
                </p>
              </div>
              <button
                @click.stop="assignDelivery(index)"
                :disabled="overlayItems[index]"
                class="bg-white text-[#50311D] w-[100px] h-[80px] px-4 py-1 rounded-md text-lg font-[SpokaHanSansNeo] font-bold"
                :class="{
                  'cursor-not-allowed opacity-50': overlayItems[index],
                  'cursor-pointer': !overlayItems[index],
                }"
              >
                배정
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
    <div v-show="activeTab === 'progress'" class="mx-[20px]">
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

// 배송 정보 데이터
const allDeliveryInfo = [
  {
    id: 1,
    date: new Date(),
    time: "11:48",
    pickUp: "따끈따끈 베이커리",
    deliver: "반월당역점",
    price: "5,400원",
    pickUpLatLng: { lat: 35.868357343, lng: 128.593475548 },
    deliverLatLng: { lat: 35.864344654, lng: 128.593335108 },
  },
  {
    id: 2,
    date: new Date(),
    time: "11:52",
    pickUp: "소베",
    deliver: "경대병원역점",
    price: "5,400원",
    pickUpLatLng: { lat: 35.869310354, lng: 128.593244905 },
    deliverLatLng: { lat: 35.863266486, lng: 128.602562449 },
  },
  {
    id: 3,
    date: new Date(),
    time: "12:01",
    pickUp: "화이트리에",
    deliver: "서대구역점",
    price: "5,400원",
    pickUpLatLng: { lat: 35.854942873, lng: 128.507705037 },
    deliverLatLng: { lat: 35.881483641, lng: 128.540176277 },
  },
  {
    id: 4,
    date: new Date(),
    time: "12:15",
    pickUp: "공주당",
    deliver: "반월당역점",
    price: "5,400원",
    pickUpLatLng: { lat: 35.867484125, lng: 128.594372877 },
    deliverLatLng: { lat: 35.864344654, lng: 128.593335108 },
  },
  {
    id: 5,
    date: new Date(),
    time: "13:20",
    pickUp: "르배",
    deliver: "동대구역점",
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

const assignDelivery = (index) => {
  overlayItems.value[index] = true;
  animatingItems.value[index] = true;

  setTimeout(async () => {
    const item = waitingList.value[index];
    progressList.value.push(item);
    waitingList.value.splice(index, 1);

    delete overlayItems.value[index];
    delete animatingItems.value[index];

    await nextTick();
    initProgressMaps();
  }, 600);
};

// 지도 초기화 (원본 그대로)
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

// watch(activeTab, async () => {
//   await nextTick();
//   if (activeTab.value === "waiting") initWaitingMaps();
//   else initProgressMaps();
// });

onMounted(() => {
  // query.tab이 있으면 사용, 없으면 'waiting'을 기본값으로
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
// watch 수정
watch(
  () => route.query.tab,
  async (newTab) => {
    // newTab이 undefined거나 빈 문자열이면 'waiting'으로
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
</style>
