<template>
  <div class="h-full overflow-y-auto">
    <div class="w-full m-auto px-[50px] py-[50px]">
      <h3 class="font-[Cafe24Surround] text-[30px] text-center text-[#50311D] mb-[50px]">마이페이지</h3>
      <div class="flex flex-col items-center">
        <!-- 프로필 -->
        <div class="w-[80px] h-[80px] bg-[#BA8E5F] rounded-full relative mb-2">
          <div @click="editB" class="w-[30px] h-[30px] bg-gray-400 rounded-full absolute bottom-[5px] -right-[10px]">
            <i class="fa-solid fa-pen absolute top-1/2 left-1/2 -translate-1/2 text-white text-sm"></i>
          </div>
          <i class="fa-solid fa-user absolute top-1/2 left-1/2 text-4xl -translate-1/2 text-white"></i>
        </div>
        <span class="text-[24px] font-[Cafe24Surround] pb-2"> 김빵장 </span>
        <div
          class="font-[SpokaHanSansNeo] px-6 py-1.5 mb-5 font-[#50311D] border border-[#50311D] rounded-md flex gap-3"
        >
          <span class="text-sm">자전거</span><span class="text-sm">|</span> <span class="text-sm">중구</span
          ><span class="text-sm">|</span>
          <span class="text-sm">업무중</span>
        </div>
        <div class="w-[600px] h-[90px] bg-[#BA8E5F] rounded-2xl relative">
          <div class="flex h-full text-center">
            <div class="flex flex-col w-1/2 justify-center gap-[5px]">
              <span class="text-[18px] font-[Cafe24Surround] text-[#FFFBF2]">5건</span>
              <span class="text-sm font-[SpokaHanSansNeo] text-[#FFFBF2]">완료건수</span>
            </div>
            <div class="flex flex-col w-1/2 justify-center gap-[5px]">
              <span class="text-[18px] font-[Cafe24Surround] text-[#FFFBF2]">50000</span>

              <span class="text-sm font-[SpokaHanSansNeo] text-[#FFFBF2]">오늘의 수입</span>
            </div>
          </div>
          <div class="w-[1.5px] h-[60px] bg-amber-50 absolute top-[50%] left-1/2 -translate-[50%] rounded-xl"></div>
        </div>
      </div>
      <div class="w-full">
        <div class="flex w-[600px] m-auto"><Calender_worker /></div>
      </div>
    </div>
    <div class="w-full h-[10px] bg-[#FFEBC2] my-[30px]"></div>
    <div class="flex flex-col gap-5 px-20 py-5 pb-[50px]">
      <a href="#">이벤트 및 공지사항</a>
      <a href="#">정산 내역</a>
      <a href="#">보험 관리</a>
      <a href="#">배달 기록</a>
      <a href="#">운행 시간</a>
    </div>
  </div>
</template>
<script setup>
import Calender_worker from "@/components/Calender_worker.vue";
</script>
<style scoped></style>
