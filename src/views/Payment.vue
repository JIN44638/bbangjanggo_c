<template>
  <div class="payment">
    <div class="inner">
      <h1>결제하기</h1>
      <div class="reserve_confirm">
        <div class="confirm_header">
          <h2>예약확인</h2>
          <button class="edit_btn" @click="toggleEditMode">{{ isEditMode ? "완료" : "수정" }}</button>
        </div>

        <!-- 일반 보기 모드 -->
        <div class="reserve_info" v-if="!isEditMode">
          <div class="name">
            <p>이름</p>
            <p>김빵장</p>
          </div>
          <div class="number">
            <p>전화번호</p>
            <p>010-1234-1234</p>
          </div>
          <div class="reserved_options_list" v-if="reservedOptions.length > 0">
            <p>선택한 옵션</p>
            <div class="selected_options">
              <div v-for="(option, index) in reservedOptions" :key="index" class="reserved_option">
                <h3>[{{ option.location }}] {{ option.temp }} / {{ option.method }}</h3>
                <p v-if="option.bakery">방문 빵집 : {{ option.bakery }}</p>
                <p>방문 일시 : {{ option.date }} [{{ option.time }}]</p>
                <p>부가서비스 : {{ option.service }}</p>
                <p class="quantity">수량 : {{ option.quantity }}</p>
              </div>
            </div>
          </div>
          <div class="price">
            <p>총 결제 금액</p>
            <div class="total_price">
              <p>{{ totalPrice.toLocaleString() }}원 <span>/4시간</span></p>
            </div>
          </div>
        </div>

        <!-- 수정 모드 -->
        <div class="edit_mode" v-else>
          <div v-for="(option, index) in reservedOptions" :key="index" class="edit_option">
            <h3>예약 {{ index + 1 }}</h3>

            <div class="edit_field">
              <label>온도</label>
              <select v-model="option.temp">
                <option value="냉보관">냉보관</option>
                <option value="상온보관">상온보관</option>
              </select>
            </div>

            <div class="edit_field">
              <label>접수 방법</label>
              <select v-model="option.method" @change="handleMethodChange(index)">
                <option value="직접 맡길게요">직접 맡길게요</option>
                <option value="기사님께 맡길게요">기사님께 맡길게요</option>
              </select>
            </div>

            <div class="edit_field" v-if="option.method === '기사님께 맡길게요'">
              <label>방문 베이커리</label>
              <select v-model="option.bakery">
                <option value="">선택해주세요</option>
                <option value="소베">소베</option>
                <option value="따끈따끈베이커리">따끈따끈베이커리</option>
                <option value="공주당">공주당</option>
                <option value="네쥬">네쥬</option>
                <option value="윈드윈">윈드윈</option>
                <option value="따따따">따따따</option>
                <option value="고려베이커리">고려베이커리</option>
                <option value="르배">르배</option>
                <option value="화이트리에 성서점">화이트리에 성서점</option>
                <option value="보밀당">보밀당</option>
              </select>
            </div>

            <div class="edit_field" v-if="option.method === '기사님께 맡길게요'">
              <label>방문 시간</label>
              <select v-model="option.time">
                <option value="">선택해주세요</option>
                <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
              </select>
            </div>

            <div class="edit_field">
              <label>부가서비스</label>
              <select v-model="option.service">
                <option value="선택 안함">선택 안함</option>
                <option value="아이스팩 +1,000">아이스팩 +1,000</option>
                <option value="보냉백 +5,000">보냉백 +5,000</option>
              </select>
            </div>

            <div class="edit_field">
              <label>수량</label>
              <select v-model.number="option.quantity">
                <option :value="1">1</option>
                <option :value="2">2</option>
                <option :value="3">3</option>
                <option :value="4">4</option>
                <option :value="5">5</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="reserve_notice">
        <h3>!확인해 주세요!</h3>
        <ul>
          <li>ㆍ접수 및 수령시, QR코드 / 예약번호 중 하나만 보여주시면 됩니다.</li>
          <li>ㆍ취소와 변경은 방문 1일 전까지 가능합니다.</li>
          <li>ㆍ방문 당일에는 취소와 변경이 어렵습니다.</li>
          <li>ㆍ예약 내역은 마이페이지에서 확인하실 수 있습니다.</li>
          <li>ㆍ기본 이용 시간 초과 시, 추가금이 부과됩니다.</li>
        </ul>
      </div>

      <h2>결제 방법</h2>
      <div class="payment_method">
        <div class="pay_online" :class="{ clicked: selectedPayment === 'online' }" @click="payOnline">
          <div class="pay_img">
            <img src="/images/pje/pay_card.png" alt="지금결제" />
          </div>
          <div class="pay_text">
            <p>지금 결제할게요</p>
            <p>예약할때 바로 결제</p>
          </div>
        </div>
        <div class="pay_offline" :class="{ clicked: selectedPayment === 'offline' }" @click="payOffline">
          <div class="pay_img">
            <img src="/images/pje/pay_later.png" alt="현장결제" />
          </div>
          <div class="pay_text">
            <p>가서 결제할게요</p>
            <p>픽업할때 함께 결제</p>
          </div>
        </div>
      </div>
      <button class="pay_btn" @click="goComplete">결제하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const reservedOptions = ref([]);
const isEditMode = ref(false);
const selectedPayment = ref("");

// 시간대 목록
const timeSlots = ref([
  "11:00 ~ 11:30",
  "11:30 ~ 12:00",
  "12:00 ~ 12:30",
  "12:30 ~ 13:00",
  "13:00 ~ 13:30",
  "13:30 ~ 14:00",
  "14:00 ~ 14:30",
  "14:30 ~ 15:00",
  "15:00 ~ 15:30",
  "15:30 ~ 16:00",
  "16:00 ~ 16:30",
  "16:30 ~ 17:00",
  "17:00 ~ 17:30",
  "17:30 ~ 18:00",
  "18:00 ~ 18:30",
  "18:30 ~ 19:00",
  "19:00 ~ 19:30",
  "19:30 ~ 20:00",
]);

onMounted(() => {
  const saved = localStorage.getItem("reservedOptions");
  if (saved) {
    reservedOptions.value = JSON.parse(saved);
  }
});

// 가격 정보
const prices = {
  무인: {
    냉보관: 3000,
    상온보관: 2500,
  },
  기사: {
    냉보관: 4000,
    상온보관: 3000,
  },
  부가서비스: {
    "아이스팩 +1,000": 1000,
    "보냉백 +5,000": 5000,
    "선택 안함": 0,
  },
};

// 개별 가격 계산
const calculatePrice = (option) => {
  let price = 0;
  if (option.method === "직접 맡길게요") {
    price = option.temp === "냉보관" ? prices.무인.냉보관 : prices.무인.상온보관;
  } else if (option.method === "기사님께 맡길게요") {
    price = option.temp === "냉보관" ? prices.기사.냉보관 : prices.기사.상온보관;
  }
  price += prices.부가서비스[option.service] || 0;
  return price * option.quantity;
};

// 총 금액 계산
const totalPrice = computed(() => reservedOptions.value.reduce((sum, item) => sum + calculatePrice(item), 0));

// 수정 모드 토글
const toggleEditMode = () => {
  if (isEditMode.value) {
    // 완료 버튼 클릭 - 유효성 검사
    const isValid = reservedOptions.value.every((option) => {
      if (option.method === "기사님께 맡길게요") {
        return option.temp && option.method && option.bakery && option.time && option.service;
      }
      return option.temp && option.method && option.service;
    });

    if (!isValid) {
      alert("모든 필수 항목을 선택해주세요.");
      return;
    }

    // 로컬스토리지에 저장
    localStorage.setItem("reservedOptions", JSON.stringify(reservedOptions.value));
    isEditMode.value = false;
  } else {
    // 수정 버튼 클릭
    isEditMode.value = true;
  }
};

// 접수 방법 변경 시 관련 필드 초기화
const handleMethodChange = (index) => {
  if (reservedOptions.value[index].method === "직접 맡길게요") {
    reservedOptions.value[index].bakery = "";
    reservedOptions.value[index].time = "자율";
  } else {
    reservedOptions.value[index].time = "";
  }
};

// 결제 방법 선택
const payOnline = () => {
  selectedPayment.value = "online";
};

const payOffline = () => {
  selectedPayment.value = "offline";
};

// 결제 완료
const goComplete = () => {
  if (!selectedPayment.value) {
    alert("결제 방법을 선택해 주세요!");
    return;
  }
  alert("결제 완료! \n접수/픽업 시, QR코드나 예약번호를 꼭 지참해 주세요!");
  router.push("/complete");
};
</script>

<style lang="scss" scoped>
@use "../assets/variables" as *;
@use "../assets/btn" as *;

h2 {
  font-size: $sub-font;
  font-family: "SpokaHanSansNeo";
  color: $font-color;
  padding: 0 0 30px;
}
h3 {
  font-size: $desc-text-font;
  font-family: "SpokaHanSansNeo";
  color: $font-color;
}
p {
  font-family: "SpokaHanSansNeo";
  color: $font-color;
  font-size: $notice-text-font;
}

.payment {
  background-color: $bg-color;
  padding-bottom: 50px;

  h1 {
    text-align: center;
    color: $point-color;
    font-family: "Cafe24Surround";
    font-size: 35px;
    padding: 50px 0;
  }

  // 예약 확인 영역
  .reserve_confirm {
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.1);
    padding: 30px;

    .confirm_header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0;

      h2 {
        padding: 0 0 30px;
      }

      .edit_btn {
        background: transparent;
        border: none;
        color: #999;
        font-size: 14px;
        cursor: pointer;
        font-family: "SpokaHanSansNeo";
        padding: 5px 0;
        transition: color 0.2s;

        &:hover {
          color: $font-color;
        }
      }
    }

    .reserve_info {
      .name,
      .number {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        font-weight: 500;
      }
    }
  }

  .reserved_options_list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    > p {
      font-weight: 500;
    }
  }

  // 선택한 옵션
  .selected_options {
    text-align: end;
    .reserved_option {
      width: 100%;
      padding: 15px 0 20px;
      position: relative;
      h3 {
        font-size: $desc-text-font;
        margin-bottom: 5px;
        color: $font-color;
      }

      p {
        font-size: $mobile-notice-font;
        color: #666;
      }
    }
  }

  .quantity {
    font-size: $mobile-notice-font;
    color: #666;
  }

  // 총 결제 금액
  .price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(186, 142, 95, 0.3);
    padding-top: 20px;

    .total_price {
      p {
        font-size: $f-a-q-text-font;
        font-weight: bold;
        color: $font-color;

        span {
          font-size: $notice-text-font;
          font-weight: normal;
          color: #949494;
        }
      }
    }
  }

  // 수정 모드
  .edit_mode {
    .edit_option {
      padding: 20px 0;
      border-bottom: 1px solid rgba(186, 142, 95, 0.2);

      &:last-child {
        border-bottom: none;
      }

      h3 {
        margin-bottom: 15px;
        padding: 0;
      }

      .edit_field {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        gap: 15px;

        label {
          min-width: 100px;
          font-weight: 500;
          color: $font-color;
          font-size: $notice-text-font;
          font-family: "SpokaHanSansNeo";
        }

        select {
          flex: 1;
          padding: 10px 15px;
          border: 2px solid $font-color;
          border-radius: 8px;
          background: white;
          color: $font-color;
          font-size: $notice-text-font;
          font-family: "SpokaHanSansNeo";
          cursor: pointer;
          transition: all 0.2s;

          &:focus {
            outline: none;
            // border-color: none;
          }
        }
      }
    }
  }

  @media (max-width: 520px) {
    .reserved_options_list {
      display: block;
    }

    .edit_mode .edit_field {
      flex-direction: column;
      align-items: flex-start !important;

      label {
        min-width: auto;
      }

      select {
        width: 100%;
      }
    }
  }

  @media (max-width: 430px) {
    h1 {
      font-size: 30px;
      padding: 30px 0;
    }
    h2 {
      font-size: $f-a-q-text-font;
    }
    p {
      font-size: $mobile-notice-font;
    }
    & {
      padding: 0 0 30px;
    }
    .reserve_confirm {
      padding: 25px;
    }
    .reserve_notice {
      h3 {
        font-size: $desc-text-font;
        padding: 0 0 5px !important;
      }
      li {
        font-size: $mobile-notice-font;
      }
    }
    .reserved_options_list {
      .reserved_option {
        h3 {
          font-size: $notice-text-font !important;
        }
      }
    }

    .total_price {
      p {
        font-size: 18px !important;
        span {
          font-size: $mobile-notice-font !important;
        }
      }
    }
    .pay_online,
    .pay_offline {
      gap: 10px !important;
      p {
        font-size: 13px !important;
        font-weight: 500 !important;
        &:last-child {
          font-size: 11px !important;
          font-weight: 400 !important;
        }
      }
    }
    .pay_btn {
      margin-top: 30px;
    }
  }
}

// 주의사항
.reserve_notice {
  padding: 30px 0;
  h3 {
    font-family: "SpokaHanSansNeo";
    color: #e00000;
    padding-bottom: 10px;
  }
}

// 결제 방법
.payment_method {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2%;
  .pay_online,
  .pay_offline {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 8px 12px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    &.clicked {
      background-color: $font-color;
      .pay_text {
        p {
          color: white !important;
        }
      }
    }
    .pay_img {
      width: 40px;
      img {
        padding: 4px;
        display: block;
        width: 100%;
        background-color: $sub-color;
        border-radius: 50%;
      }
    }
    .pay_text {
      p {
        font-weight: 600;
        font-size: $desc-text-font;
        &:last-child {
          font-weight: 400;
          color: #949494;
          font-size: $mobile-notice-font;
        }
      }
    }
    @media (max-width: 380px) {
      .pay_text {
        p {
          font-size: 12px !important;
          &:last-child {
            font-size: 10px !important;
          }
        }
      }
    }
  }
}

// 결제하기 버튼
.pay_btn {
  @include btn-style;
  display: block;
  text-align: center;
  width: 100%;
  margin-top: 50px;
  font-size: $desc-text-font;
}
</style>
