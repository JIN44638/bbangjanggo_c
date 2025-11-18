<template>
  <div class="h-full overflow-y-auto pb-[20px]">
    <!-- pb-[80px]를 pb-[20px]로 줄임 (이미 하단 메뉴가 분리되어 있으므로) -->
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
    <!-- 대기 상태 업무 -->
    <div class="mx-[20px] space-y-4">
      <!-- 배송 정보 리스트 -->
      <div v-for="(info, index) in deliverInfo" :key="index" @click="selectDelivery(index)" class="cursor-pointer">
        <!-- 지도 -->
        <div :id="'map-' + index" class="w-full h-[250px] rounded-t-lg"></div>
        <!-- 배송 정보 -->
        <div class="bg-[#C89968] text-white p-4 rounded-b-lg">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-xs font-[Cafe24Surround]">{{ formatDate(info.date) }} {{ info.time }}</p>
              <p class="text-sm font-[Cafe24Surround] mt-1 mb-2">{{ info.pickUp }} · · · · · {{ info.deliver }}</p>
              <p class="text-sm font-[Cafe24Surround]">
                (금액) <span class="text-2xl">{{ info.price }}</span>
              </p>
            </div>
            <button
              @click="selectedDelivery"
              class="cursor-pointer bg-white text-[#50311D] w-[100px] h-[80px] px-4 py-1 rounded-md text-lg font-[Cafe24Surround]"
            >
              배정
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import notices from "@/data/notice.json";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// 사용할 모듈 등록
const modules = [Autoplay];

// 알림
const noticeList = ref(notices);

// 선택된 배송 인덱스
const selectedIndex = ref(0);

// 배송 정보 데이터
const deliverInfo = [
  {
    date: new Date(),
    time: "11:48",
    pickUp: "따끈따끈 베이커리",
    deliver: "반월당역점",
    price: "5,400원",
    pickUpLatLng: { lat: 35.868357343, lng: 128.593475548 },
    deliverLatLng: { lat: 35.864344654, lng: 128.593335108 },
  },
  {
    date: new Date(),
    time: "11:52",
    pickUp: "소베",
    deliver: "경대병원역점",
    price: "5,400원",
    pickUpLatLng: { lat: 35.869310354, lng: 128.593244905 },
    deliverLatLng: { lat: 35.863266486, lng: 128.602562449 },
  },
  {
    date: new Date(),
    time: "12:01",
    pickUp: "화이트리에",
    deliver: "서대구역점",
    price: "5,400원",
    pickUpLatLng: { lat: 35.854942873, lng: 128.507705037 },
    deliverLatLng: { lat: 35.881483641, lng: 128.540176277 },
  },
  {
    date: new Date(),
    time: "12:15",
    pickUp: "공주당",
    deliver: "반월당역점",
    price: "5,400원",
    pickUpLatLng: { lat: 35.867484125, lng: 128.594372877 },
    deliverLatLng: { lat: 35.864344654, lng: 128.593335108 },
  },
  {
    date: new Date(),
    time: "13:20",
    pickUp: "르배",
    deliver: "동대구역점",
    price: "5,400원",
    pickUpLatLng: { lat: 35.870394181, lng: 128.633762538 },
    deliverLatLng: { lat: 35.879494199, lng: 128.628741351 },
  },
];

// 지도 인스턴스와 마커를 저장할 객체
const maps = ref([]);
const markers = ref([]);

// 날짜 포맷 함수
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 배송 선택 함수
const selectDelivery = (index) => {
  selectedIndex.value = index;
};

// 배정 버튼 클릭시
const selectedDelivery = () => {
  alert("배정이 완료되었습니다.");
};

// 지도 초기화
onMounted(() => {
  window.kakao.maps.load(() => {
    deliverInfo.forEach((info, index) => {
      const mapContainer = document.getElementById(`map-${index}`);

      // 지도 중심을 픽업과 배송지의 중간 지점으로 설정
      const centerLat = (info.pickUpLatLng.lat + info.deliverLatLng.lat) / 2;
      const centerLng = (info.pickUpLatLng.lng + info.deliverLatLng.lng) / 2;

      const mapOption = {
        center: new kakao.maps.LatLng(centerLat, centerLng),
        level: 5, // 초기 레벨 (setBounds가 자동 조정함)
      };

      const map = new kakao.maps.Map(mapContainer, mapOption);
      maps.value.push(map);

      // 픽업 마커 (배달 아이콘)
      const pickUpImageSrc = "/images/pje/pickup.png";
      const pickUpImageSize = new kakao.maps.Size(33, 47);
      const pickUpMarkerImage = new kakao.maps.MarkerImage(pickUpImageSrc, pickUpImageSize);

      const pickUpMarker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(info.pickUpLatLng.lat, info.pickUpLatLng.lng),
        title: info.pickUp,
        image: pickUpMarkerImage,
      });

      // 배송지 마커 (다른 아이콘)
      const deliverImageSrc = "/images/pje/deliver.png";
      const deliverImageSize = new kakao.maps.Size(33, 47);
      const deliverMarkerImage = new kakao.maps.MarkerImage(deliverImageSrc, deliverImageSize);

      const deliverMarker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(info.deliverLatLng.lat, info.deliverLatLng.lng),
        title: info.deliver,
        image: deliverMarkerImage,
      });

      markers.value.push({ pickUp: pickUpMarker, deliver: deliverMarker });

      // 두 마커가 모두 보이도록 지도 범위 설정
      const bounds = new kakao.maps.LatLngBounds();
      bounds.extend(new kakao.maps.LatLng(info.pickUpLatLng.lat, info.pickUpLatLng.lng));
      bounds.extend(new kakao.maps.LatLng(info.deliverLatLng.lat, info.deliverLatLng.lng));

      // 여유 공간을 위해 패딩 추가
      map.setBounds(bounds, 50, 50, 50, 50); // 상, 우, 하, 좌 패딩 (픽셀)
    });
  });
});
</script>
