<template>
  <div class="h-screen w-[768px] m-auto">
    <div class="flex flex-col gap-[50px] justify-center items-center h-full">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <h3 class="font-[Cafe24Surround] text-[30px] text-center text-[#50311D]">로그인</h3>
      <!-- 관리자 구분 탭 -->
      <div class="w-[335px] rounded-lg border border-[#50311D] overflow-hidden relative">
        <!-- 슬라이드 배경 -->
        <div
          class="absolute top-0 left-0 w-[50%] h-full bg-[#50311D] rounded-sm transition-transform duration-300 ease-in-out"
          :style="{ transform: activeTab === 'driver' ? 'translateX(100%)' : 'translateX(0)' }"
        ></div>
        <!-- 탭 버튼들 -->
        <div class="flex justify-between text-center relative z-10">
          <p
            @click="activeTab = 'owner'"
            class="font-[SpokaHanSansNeo] text-4 w-[50%] leading-[40px] cursor-pointer transition-colors duration-300"
            :class="activeTab === 'owner' ? 'text-white' : 'text-[#50311D]'"
          >
            관리자
          </p>
          <p
            @click="activeTab = 'driver'"
            class="font-[SpokaHanSansNeo] text-4 w-[50%] leading-[40px] cursor-pointer transition-colors duration-300"
            :class="activeTab === 'driver' ? 'text-white' : 'text-[#50311D]'"
          >
            배송기사
          </p>
        </div>
      </div>
      <!-- 로그인 -->
      <form @submit.prevent="handleLogin" class="w-full px-[85px] space-y-6">
        <div class="space-y-2">
          <input
            type="text"
            id="userId"
            placeholder="아이디 입력하기"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#50311D]"
          />
        </div>
        <div class="space-y-2">
          <div class="relative">
            <input
              v-model="password"
              id="password"
              placeholder="비밀번호를 입력하기"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#50311D]"
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <i v-if="showPassword" class="fa-solid fa-eye-slash text-gray-400"></i>
              <i v-else class="fa-solid fa-eye text-gray-400 m-[1px]"></i>
            </button>
          </div>
        </div>
        <!-- 부가 로그인 체크박스 -->
        <div class="flex gap-4 items-center">
          <!-- 아이디 저장 -->
          <div class="flex items-center">
            <input type="checkbox" id="rememberId" class="accent-[#50311D] mr-1 cursor-pointer" />
            <label for="rememberId" class="text-[#50311D] text-[14px] font-[SpokaHanSansNeo] cursor-pointer"
              >아이디 저장</label
            >
          </div>
          <!-- 자동 로그인 -->
          <div class="flex items-center">
            <input type="checkbox" id="autoLogin" class="accent-[#50311D] mr-1 cursor-pointer" />
            <label for="autoLogin" class="text-[#50311D] text-[14px] font-[SpokaHanSansNeo] cursor-pointer"
              >자동 로그인</label
            >
          </div>
        </div>
        <!-- 부가 로그인 서비스 -->
        <div
          class="flex justify-center gap-4 items-center text-[#50311D] text-[14px] font-[SpokaHanSansNeo] cursor-pointer"
        >
          <p>아이디 찾기</p>
          <span>│</span>
          <p>비밀번호 찾기</p>
          <span>│</span>
          <p>회원가입</p>
        </div>
        <!-- 로그인 버튼  -->
        <button
          type="submit"
          class="w-full py-3 bg-[#50311D] text-white font-[16px] font-[SpokaHanSansNeo] cursor-pointer rounded-md transition-colors duration-200"
        >
          로그인
        </button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute()

// 탭 상태 관리
const activeTab = ref("owner"); // 'owner' 또는 'driver'

// 초기 진입 시 query(tab) 확인
if (route.query.tab === "driver") {
  activeTab.value = "driver";
}

const password = ref("");
const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = () => {
  // activeTab 값에 따라 다른 경로로 이동할 수 있어요
  if (activeTab.value === "owner") {
    router.push("/admin/dashboard");
  } else {
    router.push("/worker/dashboard");
  }
};
</script>
