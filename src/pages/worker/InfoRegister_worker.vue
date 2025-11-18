<template>
  <!-- Font Awesome CDN 추가 -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <div class="min-h-screen w-[768px] m-auto px-[85px] py-[85px]">
    <h3 class="font-[Cafe24Surround] text-[30px] text-center text-[#50311D] mb-[50px]">필수 정보 입력</h3>
    <!-- 정보 입력란 -->

    <div class="flex flex-col gap-[30px]">
      <!-- 주소 입력 -->
      <div class="flex flex-col gap-[30px]">
        <h3 class="font-[Cafe24Surround] text-[20px] text-[#50311D]">주소 및 배송 정보</h3>
        <!-- 주소 검색 -->
        <div>
          <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">주소</h3>
          <div
            @click="execDaumPostcode"
            class="border border-[#50311D] px-3 py-2 rounded-md flex justify-between items-center"
          >
            <input
              type="text"
              id="sample3_address"
              placeholder="주소 입력하기"
              class="w-[90%] font-[SpokaHanSansNeo] focus:outline-none"
            />
            <button>
              <i class="fa-solid fa-magnifying-glass text-[#50311D] cursor-pointer"></i>
            </button>
          </div>

          <!-- 주소 팝업 -->
          <div>
            <div id="wrap" ref="wrapRef" class="hidden border w-full h-[300px] m-auto relative">
              <img
                src="//t1.daumcdn.net/postcode/resource/images/close.png"
                id="btnFoldWrap"
                class="cursor-pointer absolute right-[0px] top[0px] z-1"
                @click="foldDaumPostcode"
                alt="접기 버튼"
              />
            </div>
          </div>
        </div>

        <!-- 상세 주소 -->
        <div>
          <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">상세 주소(선택)</h3>
          <input
            type="text"
            id="sample3_detailAddress"
            placeholder="상세주소 입력하기"
            class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
          />
        </div>

        <!-- 배달 지역 선택 -->
        <div>
          <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">배달 지역</h3>
          <div class="relative w-full">
            <button
              type="button"
              @click="locationDropdown"
              class="w-full flex justify-between items-center px-3 py-2 border border-[#50311D] rounded-md"
            >
              <span class="font-[SpokaHanSansNeo]" :class="selectedLocation ? 'text-gray-800' : 'text-gray-500'">
                {{ selectedLocation?.location || placeholder1 }}
              </span>
              <i
                class="fa-solid fa-caret-down text-[#50311D] transition-transform duration-500"
                :class="isLocationOpen ? 'rotate-180' : 'rotate-0'"
              ></i>
            </button>

            <div
              v-if="isLocationOpen"
              class="font-[SpokaHanSansNeo] absolute left-0 right-0 bg-white shadow-sm rounded-lg max-h-60 overflow-auto scrollbar-none z-20"
            >
              <button
                v-for="option in locationOptions"
                :key="option.location"
                @click="selectLocation(option)"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {{ option.location }}
              </button>
            </div>
          </div>
        </div>

        <!-- 배달 수단 선택 -->
        <div>
          <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">배달 수단</h3>
          <div class="relative w-full">
            <button
              type="button"
              @click="vehicleDropdown"
              class="w-full flex justify-between items-center px-3 py-2 border border-[#50311D] rounded-md"
            >
              <span class="font-[SpokaHanSansNeo]" :class="selectedVehicle ? 'text-gray-800' : 'text-gray-500'">
                {{ selectedVehicle?.vehicle || placeholder2 }}
              </span>

              <i
                class="fa-solid fa-caret-down text-[#50311D] transition-transform duration-500"
                :class="isVehicleOpen ? 'rotate-180' : 'rotate-0'"
              ></i>
            </button>

            <div
              v-if="isVehicleOpen"
              class="font-[SpokaHanSansNeo] absolute left-0 right-0 bg-white shadow-sm rounded-lg max-h-60 overflow-auto scrollbar-none z-20"
            >
              <button
                v-for="option in vehicleOption"
                :key="option.vehicle"
                @click="selectVehicle(option)"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {{ option.vehicle }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 계좌 정보 입력 -->
      <div class="flex flex-col gap-[30px]">
        <h3 class="font-[Cafe24Surround] text-[20px] text-[#50311D]">계좌 정보</h3>

        <!-- 은행 선택 -->
        <div>
          <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">은행</h3>
          <div class="relative w-full">
            <button
              type="button"
              @click="bankDropdown"
              class="w-full flex justify-between items-center px-3 py-2 border border-[#50311D] rounded-md"
            >
              <span class="font-[SpokaHanSansNeo]" :class="selectedBank ? 'text-gray-800' : 'text-gray-500'">
                {{ selectedBank?.bank || placeholder3 }}
              </span>

              <i
                class="fa-solid fa-caret-down text-[#50311D] transition-transform duration-500"
                :class="isBankOpen ? 'rotate-180' : 'rotate-0'"
              ></i>
            </button>

            <div
              v-if="isBankOpen"
              class="font-[SpokaHanSansNeo] absolute left-0 right-0 bg-white shadow-sm rounded-lg max-h-60 overflow-auto scrollbar-none z-20"
            >
              <button
                v-for="option in bankOptions"
                :key="option.bank"
                @click="selectBank(option)"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {{ option.bank }}
              </button>
            </div>
          </div>
        </div>

        <!-- 예금주 입력 -->
        <div>
          <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">예금주</h3>
          <input
            type="text"
            v-model="accountName"
            placeholder="예금주 입력하기"
            class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
          />
        </div>

        <!-- 계좌번호 입력 -->
        <div>
          <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">계좌번호</h3>
          <input
            type="text"
            v-model="accountNumber"
            placeholder="계좌번호 - 없이 입력하기"
            class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
          />
        </div>
      </div>

      <!-- 배달료 확인 -->
      <div>
        <div @click="toggleFeeSection">
          <span class="font-[SpokaHanSansNeo] text-4 text-[#50311D] cursor-pointer">배달료 확인하기</span>
          <i
            class="fas fa-chevron-right text-[15px] text-[#50311D] cursor-pointer ml-1 transition-transform duration-300"
            :class="isFeeOpen ? 'rotate-90' : 'rotate-0'"
          ></i>
        </div>

        <div v-if="isFeeOpen">
          <table class="w-full text-center my-4">
            <thead>
              <tr class="bg-[#BA8E5F]">
                <th
                  class="w-[50%] border-r border-gray-200 px-3 py-2 whitespace-nowrap text-[14px] text-white font-[SpokaHanSansNeo] font-normal"
                >
                  배달 지역
                </th>
                <th
                  class="w-[50%] px-3 py-2 whitespace-nowrap text-[14px] text-white font-[SpokaHanSansNeo] font-normal"
                >
                배달료
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-200">
                <td
                  class="border-r border-gray-200 px-3 py-2 whitespace-nowrap text-[14px] text-gray-700 font-[SpokaHanSansNeo]"
                >
                  주요 배달 지역
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-[14px] text-gray-700 font-[SpokaHanSansNeo]">~5,400원</td>
              </tr>
              <tr class="border-b border-gray-200">
                <td
                  class="border-r border-gray-200 px-3 py-2 whitespace-nowrap text-[14px] text-gray-700 font-[SpokaHanSansNeo]"
                >
                  주요 배달 지역 외
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-[14px] text-gray-700 font-[SpokaHanSansNeo]">+500원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="cursor-pointer mt-1" @click="toggleAgreeFee">
          <i class="fa-solid fa-check mr-1" :class="isAgreeFee ? 'text-[#00ADD8]' : 'text-gray-400'"></i>
          <span class="font-[SpokaHanSansNeo] text-[14px]" :class="isAgreeFee ? 'text-[#00ADD8]' : 'text-gray-400'">
            배달료를 확인했으며 이에 동의합니다.
          </span>
        </div>
      </div>
    </div>

    <button
      type="button"
      @click="finishSignup"
      class="w-full py-3 bg-[#50311D] text-white font-4 font-[SpokaHanSansNeo] cursor-pointer rounded-md transition-colors duration-200 mt-[50px]"
    >
      완료하기
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const wrapRef = ref(null);

// 예금주 / 계좌번호
const accountName = ref("");
const accountNumber = ref("");

// 주소 검색 접기
function foldDaumPostcode() {
  if (wrapRef.value) wrapRef.value.style.display = "none";
}

function execDaumPostcode() {
  const elementWrap = wrapRef.value;
  if (!elementWrap) return;

  const currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);

  new window.daum.Postcode({
    oncomplete: function (data) {
      let addr = "";
      addr = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

      document.getElementById("sample3_address").value = addr;
      document.getElementById("sample3_detailAddress").focus();

      elementWrap.style.display = "none";
      document.body.scrollTop = currentScroll;
    },
    onresize(size) {
      elementWrap.style.height = size.height + "px";
    },
    width: "100%",
    height: "100%",
  }).embed(elementWrap);

  elementWrap.style.display = "block";
}

// 드롭다운
const isLocationOpen = ref(false);
const isVehicleOpen = ref(false);
const isBankOpen = ref(false);
const selectedLocation = ref(null);
const selectedVehicle = ref(null);
const selectedBank = ref(null);

const placeholder1 = "배달 지역 선택하기";
const placeholder2 = "배달 수단 선택하기";
const placeholder3 = "은행 선택하기";

const locationOptions = [
  { location: "중구" },
  { location: "동구" },
  { location: "서구" },
  { location: "남구" },
  { location: "북구" },
  { location: "수성구" },
  { location: "달서구" },
];

const vehicleOption = [
  { vehicle: "오토바이" },
  { vehicle: "자전거" },
  { vehicle: "도보" },
  { vehicle: "승용차" },
  { vehicle: "트럭" },
];

const bankOptions = [
  { bank: "카카오뱅크" },
  { bank: "국민은행" },
  { bank: "기업은행" },
  { bank: "농협은행" },
  { bank: "신한은행" },
  { bank: "iM뱅크" },
  { bank: "우리은행" },
  { bank: "한국씨티은행" },
  { bank: "하나은행" },
  { bank: "우체국" },
  { bank: "토스뱅크" },
];

const locationDropdown = () => (isLocationOpen.value = !isLocationOpen.value);
const vehicleDropdown = () => (isVehicleOpen.value = !isVehicleOpen.value);
const bankDropdown = () => (isBankOpen.value = !isBankOpen.value);

const selectLocation = (opt) => {
  selectedLocation.value = opt;
  isLocationOpen.value = false;
};
const selectVehicle = (opt) => {
  selectedVehicle.value = opt;
  isVehicleOpen.value = false;
};
const selectBank = (opt) => {
  selectedBank.value = opt;
  isBankOpen.value = false;
};

// 배달료
const isFeeOpen = ref(false);
const toggleFeeSection = () => (isFeeOpen.value = !isFeeOpen.value);

const isAgreeFee = ref(false);
const toggleAgreeFee = () => (isAgreeFee.value = !isAgreeFee.value);

// ✔ 완료하기
const finishSignup = () => {
  const address = document.getElementById("sample3_address")?.value || "";

  // 필수 항목 체크
  if (
    !address ||
    !selectedLocation.value ||
    !selectedVehicle.value ||
    !selectedBank.value ||
    !accountName.value ||
    !accountNumber.value ||
    !isAgreeFee.value
  ) {
    alert("필수 항목을 모두 입력해주세요!");
    return;
  }

  alert("회원 가입 완료!");
  router.push({ path: "/loginworker", query: { tab: "driver" } });
};
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
