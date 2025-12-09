<template>
  <div class="min-h-screen w-full max-w-[768px] m-auto p-[85px]">
    <h3 class="font-[Cafe24Surround] text-[30px] text-center text-[#50311D] mb-[50px]">회원 가입</h3>

    <form @submit.prevent="handleRegister" class="flex flex-col gap-[30px]">
      <!-- 이름 -->
      <div>
        <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">이름</h3>
        <input
          type="text"
          v-model="name"
          placeholder="이름 입력하기"
          required
          class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
        />
      </div>

      <!-- 전화번호 -->
      <div>
        <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">전화번호</h3>
        <div class="flex gap-2 items-center">
          <input
            id="phone"
            v-model="phone"
            @input="formatPhone"
            type="text"
            placeholder="전화번호 입력하기"
            required
            class="font-[SpokaHanSansNeo] flex-1 border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
          />
          <button
            type="button"
            :disabled="isSending || codeSuccess"
            @click="sendCode"
            :class="[
              'cursor-pointer w-[105px] h-[42px] text-[14px] px-3 py-2 rounded-md font-[SpokaHanSansNeo]',
              isSending || codeSuccess ? 'bg-gray-300 text-gray-500' : 'bg-[#50311D] text-white',
            ]"
          >
            {{ codeSuccess ? "인증번호 발송" : isResend ? "재발송" : "인증번호 발송" }}
          </button>
        </div>

        <!-- 인증 완료 메시지 -->
        <p v-if="codeSuccess" class="mt-2 text-[#00ADD8] text-sm font-[SpokaHanSansNeo]">인증을 완료했습니다.</p>
      </div>

      <!-- 인증번호 입력 영역 -->
      <div v-if="showCodeInput && !codeSuccess">
        <div class="flex gap-2 items-center">
          <div class="relative flex-1">
            <input
              v-model="inputCode"
              type="text"
              maxlength="6"
              placeholder="인증번호 입력하기"
              required
              class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none pr-20"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[#E67E50] text-[14px] font-[SpokaHanSansNeo]">
              {{ timerText }}
            </span>
          </div>
          <button
            type="button"
            @click="checkCode"
            class="cursor-pointer w-[105px] h-[42px] bg-[#50311D] text-white px-3 py-2 rounded-md font-[SpokaHanSansNeo] text-[14px]"
          >
            확인
          </button>
        </div>
        <!-- 인증 실패 메시지 -->
        <p v-if="codeMessage" class="mt-2 text-[#00ADD8] text-sm font-[SpokaHanSansNeo]">
          {{ codeMessage }}
        </p>
      </div>

      <!-- 아이디 -->
      <div>
        <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">아이디</h3>
        <input
          type="text"
          v-model="id"
          placeholder="아이디 입력하기"
          required
          class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
        />
      </div>

      <!-- 비밀번호 -->
      <div>
        <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">
          비밀번호 <span class="text-[12px]">( 8자 이상, 영문자 + 숫자 포함)</span>
        </h3>
        <input
          type="password"
          v-model="password"
          maxlength="10"
          placeholder="비밀번호 입력하기"
          required
          class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
        />
      </div>

      <!-- 비밀번호 확인 -->
      <div>
        <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">비밀번호 확인</h3>
        <input
          type="password"
          maxlength="10"
          v-model="passwordConfirm"
          @input="checkPasswordMatch"
          placeholder="비밀번호 재입력하기"
          required
          class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
        />
        <p
          v-if="passwordMessage"
          :class="passwordMatch ? 'text-[#00ADD8]' : 'text-[#E67E50]'"
          class="font-[SpokaHanSansNeo] mt-2 text-sm"
        >
          {{ passwordMessage }}
        </p>
      </div>
      <SignupTerms />
      <button
        type="submit"
        class="w-full py-3 bg-[#50311D] text-white font-4 font-[SpokaHanSansNeo] cursor-pointer rounded-md transition-colors duration-200 -mt-[5px]"
      >
        완료하기
      </button>
    </form>
  </div>
</template>

<script setup>
import SignupTerms from "@/components/SignupTerms.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const name = ref("");
const phone = ref("");
const id = ref("");
const password = ref("");
const passwordConfirm = ref("");
const isSending = ref(false);
const isResend = ref(false);
const showCodeInput = ref(false);
const timer = ref(0);
const timerText = ref("");
const timerInterval = ref(null);
const inputCode = ref("");
const codeMessage = ref("");
const codeSuccess = ref(false);

const passwordMessage = ref("");
const passwordMatch = ref(false);

// 전화번호 포맷
const formatPhone = (e) => {
  let value = e.target.value.replace(/[^0-9]/g, "");
  if (value.length < 4) {
    value = value;
  } else if (value.length < 8) {
    value = value.slice(0, 3) + "-" + value.slice(3);
  } else {
    value = value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11);
  }
  e.target.value = value;
  phone.value = value;
};

// 인증번호 발송
const sendCode = () => {
  isSending.value = true;
  showCodeInput.value = true;
  codeMessage.value = "";
  codeSuccess.value = false;
  inputCode.value = "";
  timer.value = 120;
  updateTimer();

  setTimeout(() => {
    isSending.value = false;
    isResend.value = true;
  }, 3000);
};

// 타이머 업데이트
const updateTimer = () => {
  clearInterval(timerInterval.value);
  timerInterval.value = setInterval(() => {
    if (timer.value <= 0) {
      clearInterval(timerInterval.value);
      timerText.value = "0:00";
      if (!codeSuccess.value) {
        codeMessage.value = "인증에 실패했습니다.";
      }
      return;
    }
    timer.value--;
    const m = Math.floor(timer.value / 60);
    const s = timer.value % 60;
    timerText.value = `${m}:${s.toString().padStart(2, "0")}`;
  }, 1000);
};

// 인증번호 확인
const checkCode = () => {
  if (inputCode.value === "123456") {
    codeSuccess.value = true;
    codeMessage.value = "인증을 완료했습니다.";
    clearInterval(timerInterval.value);
  } else {
    codeSuccess.value = false;
    codeMessage.value = "인증번호가 일치하지 않습니다.";
  }
};

// 비밀번호 확인
const checkPasswordMatch = () => {
  if (passwordConfirm.value.length === 0) {
    passwordMessage.value = "";
    return;
  }
  if (password.value === passwordConfirm.value) {
    passwordMatch.value = true;
    passwordMessage.value = "비밀번호가 일치합니다.";
  } else {
    passwordMatch.value = false;
    passwordMessage.value = "비밀번호가 일치하지 않습니다.";
  }
};

// 회원가입 버튼 처리
const handleRegister = () => {
  // 필수 입력값 확인
  if (!name.value || !phone.value || !id.value || !password.value || !passwordConfirm.value || !codeSuccess.value) {
    alert("정보를 모두 입력해주세요!");
    return;
  }

  alert("회원가입이 완료 되었습니다!");
  router.push("/register"); // 라우터 이동
};
</script>
