<template>
  <div class="min-h-screen w-[768px] m-auto px-[85px] py-[85px]">
    <h3 class="font-[Cafe24Surround] text-[30px] text-center text-[#50311D] mb-[50px]">회원 가입</h3>
    <div class="flex flex-col gap-[30px]">
      <div>
        <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">이름</h3>
        <input
          type="text"
          placeholder="이름 입력하기"
          class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
        />
      </div>
      <div>
        <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">전화번호</h3>
        <div class="flex gap-2">
          <input
            type="text"
            placeholder="전화번호 입력하기"
            class="font-[SpokaHanSansNeo] flex-1 border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
          />
          <button class="bg-[#50311D] text-[14px] px-3 py-2 rounded-md text-white font-[SpokaHanSansNeo]">
            인증번호 발송
          </button>
        </div>
      </div>
      <div>
        <!-- <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">인증번호</h3> -->
        <input
          type="text"
          placeholder="인증번호 입력하기"
          class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
        />
      </div>
      <div>
        <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">아이디</h3>
        <input
          type="text"
          placeholder="아이디 입력하기"
          class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
        />
      </div>
      <div>
        <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">
          비밀번호 <span class="text-[12px]">( 8자 이상, 영문자 + 숫자 포함)</span>
        </h3>
        <input
          type="text"
          placeholder="비밀번호 입력하기"
          class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
        />
      </div>
      <div>
        <h3 class="font-[SpokaHanSansNeo] text-4 text-[#50311D] mb-4">비밀번호 확인</h3>
        <input
          type="text"
          placeholder="비밀번호 재입력하기"
          class="font-[SpokaHanSansNeo] w-full border border-[#50311D] px-3 py-2 rounded-md focus:outline-none"
        />
      </div>
    </div>
    <button
      type="button"
      class="w-full py-3 bg-[#50311D] text-white font-4 font-[SpokaHanSansNeo] cursor-pointer rounded-md transition-colors duration-200 mt-[50px]"
    >
      완료하기
    </button>
  </div>
</template>
<script setup></script>
