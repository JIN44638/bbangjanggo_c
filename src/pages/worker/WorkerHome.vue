<template>
  <div class="w-full max-w-[768px] m-auto h-screen flex flex-col relative">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

    <!-- router-view 영역 -->
    <div class="flex-1 overflow-hidden relative">
      <router-view></router-view>

      <!-- 오버레이 (메뉴 열릴 때만 보임) -->
      <div
        v-if="isSubMenuOpen"
        class="z-[999] absolute inset-0 bg-black/40 transition-opacity duration-300"
        @click="closeSubMenu"
      ></div>

      <!-- 서브메뉴 슬라이드 패널 -->
      <div
        class="z-[999] absolute top-0 right-0 bg-white shadow-lg transition-transform duration-300"
        :class="isSubMenuOpen ? 'translate-x-0' : 'translate-x-full'"
        style="width: 70%; max-width: 300px; height: 100%"
      >
        <!-- 서브메뉴 컨텐츠 -->
        <div class="relative h-full">
          <div>
            <button
              @click="closeSubMenu"
              class="p-5 absolute right-[30px] text-[25px] cursor-pointer text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="flex flex-col justify-between h-full">
            <div class="py-14">
              <!-- 서브메뉴 프로필 -->
              <div class="border-b border-gray-200">
                <div class="px-6">
                  <h3 class="font-[Cafe24Surround] text-[24px] text-[#50311D] mb-4">김빵장 라이더님</h3>
                  <div class="flex gap-10">
                    <div>
                      <p class="text-gray-400 font-[SpokaHanSansNeo] text-[14px]">완료건수</p>
                      <p class="text-[#50311D] font-[SpokaHanSansNeo] text-[18px] font-bold">5건</p>
                    </div>
                    <div class="mb-6">
                      <p class="text-gray-400 font-[SpokaHanSansNeo] text-[14px]">오늘의 수입</p>
                      <p class="text-[#50311D] font-[SpokaHanSansNeo] text-[18px] font-bold">50,000원</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 서브 메뉴 -->
              <div class="p-6">
                <!-- <h2 class="text-xl font-bold text-[#50311D] font-[SpokaHanSansNeo] mb-4">메뉴</h2> -->
                <ul class="space-y-4 font-[SpokaHanSansNeo]">
                  <li
                    @click="goMenu('/worker/dashboard?tab=progress')"
                    class="text-lg text-[#50311D] cursor-pointer flex gap-2 items-center"
                  >
                    <div class="w-[24px]">
                      <i class="fa-solid fa-check"></i>
                    </div>
                    <p>배정 완료</p>
                  </li>
                  <li
                    @click="goMenu('/worker/notice?tab=alert')"
                    class="text-lg text-[#50311D] cursor-pointer flex gap-2 items-center"
                  >
                    <div class="w-[24px]"><i class="fa-solid fa-bell"></i></div>
                    <p>개별 알림</p>
                  </li>
                  <li
                    @click="goMenu('/worker/jobs?view=list')"
                    class="text-lg text-[#50311D] cursor-pointer flex gap-2 items-center"
                  >
                    <div class="w-[24px]"><i class="fa-solid fa-truck"></i></div>
                    <p>진행 중인 업무</p>
                  </li>
                  <li
                    @click="goMenu('/worker/mypage')"
                    class="text-lg text-[#50311D] cursor-pointer flex gap-2 items-center"
                  >
                    <div class="w-[24px]"><i class="fa-solid fa-cash-register"></i></div>
                    <p>정산내역</p>
                  </li>
                  <li
                    @click="goMenu('/worker/notice?tab=news')"
                    class="text-lg text-[#50311D] cursor-pointer flex gap-2 items-center"
                  >
                    <div class="w-[24px]"><i class="fa-solid fa-bullhorn"></i></div>
                    <p>공지사항</p>
                  </li>
                  <li class="text-lg text-[#50311D] cursor-pointer flex gap-2 items-center">
                    <div class="w-[24px]"><i class="fa-solid fa-circle-question"></i></div>
                    <p>문의하기</p>
                  </li>
                </ul>
              </div>
            </div>

            <!-- 로그아웃 -->
            <div class="border-t border-gray-200">
              <button
                @click="workerLogOut"
                class="cursor-pointer w-full flex items-center justify-center p-5 text-gray-400 transition-colors"
              >
                <i class="fa-solid fa-right-from-bracket mr-3 w-5"></i>
                <p>로그아웃</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 메뉴바 -->
    <nav class="z-[9999] flex bg-white w-full h-[60px] shadow-[0px_-1px_5px_rgba(0,0,0,0.05)]">
      <router-link
        :to="link.path"
        v-for="link in links"
        :key="link.path"
       class="flex-1 flex flex-col items-center justify-center gap-1 transition-colors text-center"
        @click="activateMenu(link.path)"
      >
        <i :class="[link.icon, 'text-2xl', activeMenu === link.path ? 'text-[#50311D]' : 'text-[#969696]']"></i>
        <span
          class="text-xs font-[SpokaHanSansNeo] leading-none"
          :class="activeMenu === link.path ? 'text-[#50311D]' : 'text-gray-400'"
        >
          {{ link.name }}
        </span>
      </router-link>

      <!-- 서브메뉴 버튼 -->
      <button
        @click="toggleSubMenu"
        class="flex-1 flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer text-center"
        :class="isSubMenuOpen ? 'text-[#50311D]' : 'text-gray-400'"
      >
        <i class="fa-solid fa-bars text-2xl"></i>
        <span class="text-xs font-[SpokaHanSansNeo] leading-none">메뉴</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// 서브메뉴 토글 상태
const isSubMenuOpen = ref(false);
const activeMenu = ref(route.path);

const links = [
  { name: "홈", path: "/worker/dashboard", icon: "fa-solid fa-house" },
  { name: "알림", path: "/worker/notice", icon: "fa-solid fa-bell" },
  { name: "오늘의 업무", path: "/worker/jobs", icon: "fa-solid fa-truck" },
  { name: "마이페이지", path: "/worker/mypage", icon: "fa-solid fa-user" },
];

const activateMenu = (path) => {
  activeMenu.value = path;
  isSubMenuOpen.value = false;
  // dashboard로 갈 때는 명시적으로 waiting 탭으로
  if (path === "/worker/dashboard") {
    router.push({ path: "/worker/dashboard", query: { tab: "waiting" } });
  } else if (path === "/worker/notice") {
    router.push({ path: "/worker/notice", query: { tab: "news" } });
  } else if (path === "/worker/jobs") {
    router.push({ path: "/worker/jobs", query: {} });
  }
};

const toggleSubMenu = () => {
  isSubMenuOpen.value = !isSubMenuOpen.value;

  if (isSubMenuOpen.value) activeMenu.value = null;
};

const closeSubMenu = () => {
  isSubMenuOpen.value = false;
};

const goMenu = (path) => {
  isSubMenuOpen.value = false;

  // path에서 기본 경로만 추출 (query 제거)
  let basePath = path;
  if (path.includes("?")) {
    basePath = path.split("?")[0];
  }

  // activeMenu 업데이트
  activeMenu.value = basePath;

  // 현재 경로와 같은지 확인
  const isSamePath = route.path === basePath;

  // if (path === "/worker/jobs" || basePath === "/worker/jobs") {
  //   if (isSamePath) {
  //     // 같은 페이지면 replace 사용
  //     router.replace({ path: "/worker/jobs", query: { view: "list" } });
  //   } else {
  //     router.push({ path: "/worker/jobs", query: { view: "list" } });
  //   }
  //   return;
  // }

  if (path.includes("?")) {
    const [pathname, queryString] = path.split("?");
    const queryParams = {};
    queryString.split("&").forEach((param) => {
      const [key, value] = param.split("=");
      queryParams[key] = value;
    });

    if (isSamePath) {
      // 같은 페이지면 replace로 query만 변경
      router.replace({ path: pathname, query: queryParams });
    } else {
      router.push({ path: pathname, query: queryParams });
    }
    return;
  }

  router.push(path);
};

const workerLogOut = () => {
  isSubMenuOpen.value = false;
  router.push("/loginworker");
};

watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath;
    isSubMenuOpen.value = false;
  }
);
</script>
