<template>
  <header :class="[{ scrolled: isScrolled }, { dark: isDark }, { 'not-home': !isHome }]">
    <div class="inner">
      <!-- 로고 -->
      <RouterLink to="/" class="header-logo" @click.prevent="handleLogoClick">
        <img src="/images/pje/logo_white.png" alt="빵장고 로고" class="logo" />
      </RouterLink>

      <!-- 🔗유저 버튼 -->
      <div class="user-buttons">
        <!-- 로그아웃버튼 -->
        <router-link
          v-if="loggedInUser"
          to="/login"
          class="loginIcon"
          :key="'logout-' + loggedInUser?.name"
          @click.prevent="logout"
          ><img src="/images/kms/logout-icon.png" alt=""
        /></router-link>
        <!-- 로그인 버튼 -->
        <router-link v-else to="/login" key="login" class="logoutIcon"
          ><img src="/images/kms/login-icon.png" alt=""
        /></router-link>
        <!-- 마이페이지 버튼 -->
        <router-link to="/login" @click.prevent="goMyPage" class="mypageIcon"
          ><img src="/images/kms/mypage-icon.png" alt=""
        /></router-link>

        <!-- 햄버거 바 -->
        <button
          class="hamburger"
          :class="{ active: isMenuOpen }"
          @click="toggleMenu"
          aria-label="모바일 메뉴 토글"
          aria-expanded="isMenuOpen.toString()"
        >
          <div class="line" v-for="n in 3" :key="n"></div>
        </button>
      </div>

      <!-- 🔗헤더 메뉴 -->
      <nav class="header-menu">
        <RouterLink to="/reservation">{{ $t("header.reserve")}}</RouterLink>
        <a href="#location" @click.prevent="goToSection('location')">{{ $t("header.location")}}</a>
        <a href="#howto" @click.prevent="goToSection('howto')">{{ $t("header.howto")}}</a>
        <a href="#price" @click.prevent="goToSection('price')">{{ $t("header.price")}}</a>
        <a href="#faq" @click.prevent="goToSection('faq')">{{ $t("header.faq")}}</a>
      </nav>

      <!-- 헤더 로그인 메뉴 -->
      <div class="header-loginMenu">
        <!-- 로그인 상태 -->
        <div v-if="loggedInUser" class="loginIcon" :key="'logout-' + loggedInUser?.name" @click.prevent="logout">
          <RouterLink to="/login">{{ $t("status.logout")}}</RouterLink>
        </div>
        <!-- 로그아웃 상태-->
        <div class="user-logform-logout" v-else to="/login" key="login">
          <RouterLink to="/login">{{ $t("status.login")}}</RouterLink>
          <RouterLink to="/signup">{{ $t("status.signup")}}</RouterLink>
        </div>
        <!-- 마이페이지 -->
        <RouterLink to="/login" @click.prevent="goMyPage">{{ $t("status.mypage")}}</RouterLink>
        <!-- 언어변경 선택박스 -->
        <!-- 언어변경 -->
        <div class="lang-select">
          <label class="sr-only" for="lang">{{ t("lang.label") }}</label>
          <select id="lang" v-model="currentLang" @change="onChangeLang">
            <option value="ko">{{ t("lang.ko") }}</option>
            <option value="en">{{ t("lang.en") }}</option>
            <option value="ja">{{ t("lang.ja") }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 햄버거 바 메뉴 -->
    <div class="backdrop" :class="{ open: isMenuOpen }" @click="closeMenu"></div>
    <div class="mobile-menu" :class="{ open: isMenuOpen }">
      <!-- 서비스 메뉴 -->
      <nav class="mobile-nav">
        <RouterLink to="/reservation" @click="closeMenu">예약하기</RouterLink>
        <a href="#location" @click.prevent="goToSection('location')">지점안내</a>
        <a href="#howto" @click.prevent="goToSection('howto')">이용방법</a>
        <a href="#price" @click.prevent="goToSection('price')">요금안내</a>
        <a href="#faq" @click.prevent="goToSection('faq')">FAQ|문의</a>
      </nav>
      <!-- 로그인 메뉴 -->
      <div class="mobile-login">
        <!-- 로그인 상태 -->
        <div v-if="loggedInUser" class="loginIcon" :key="'logout-' + loggedInUser?.name" @click.prevent="logout">
          <RouterLink to="/login">로그아웃</RouterLink>
        </div>
        <!-- 로그아웃 상태-->
        <div class="user-logform-logout" v-else to="/login" key="login">
          <RouterLink to="/login">로그인</RouterLink>
          <RouterLink to="/signup">회원가입</RouterLink>
        </div>
        <div v-if="loggedInUser" class="loginIcon" :key="'logout-' + loggedInUser?.name" @click="closeMenu">
          <RouterLink to="/mypage">마이페이지</RouterLink>
        </div>
        <div v-else to="/login" key="login" @click.prevent="goMyPage">
          <RouterLink to="/login">마이페이지</RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const loggedInUser = ref(null);

// 로그인 상태 체크
const checkedLogin = () => {
  try {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      // 유효한 JSON인지 확인
      const parsed = JSON.parse(user);
      loggedInUser.value = parsed;
    } else {
      loggedInUser.value = null;
    }
  } catch (error) {
    // JSON 파싱 오류 발생 시 localStorage 정리
    console.error("로그인 정보 파싱 오류:", error);
    localStorage.removeItem("loggedInUser");
    loggedInUser.value = null;
  }
};

onMounted(() => {
  checkedLogin();

  // 다른 탭이나 페이지에서 로그인 상태가 바뀌면 감지
  window.addEventListener("storage", checkedLogin);
  // ✅ 페이지 이동 후 항상 메뉴 닫기
  router.afterEach(() => {
    closeMenu();
  });
});

onUnmounted(() => {
  window.removeEventListener("storage", checkedLogin);
});

// ✅ 로그인/로그아웃 후에도 즉시 반영되도록 watch 추가
watch(
  () => localStorage.getItem("loggedInUser"),
  () => checkedLogin()
);

// 스크롤 상태 저장
const isScrolled = ref(false);

// 현재 라우트 감지
const router = useRouter();
const route = useRoute();
const isHome = computed(() => route.path === "/");

// 모바일 메뉴 상태
const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  document.body.style.overflow = isMenuOpen.value ? "hidden" : "";
};
const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = "";
};

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50; // 50px 이상 스크롤하면 true로 변경
};

// 부모 (App.vue)에서 받은 값
const props = defineProps({
  isDark: Boolean,
});

// 페이지가 마운트될 때 스크롤 이벤트 리스너 추가
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

// 페이지가 언마운트될 때 스크롤 이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// 스크롤이동 적용하기
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  const header = document.querySelector("header"); // header 요소를 직접 참조

  if (element) {
    const headerOffset = header.offsetHeight;
    // const headerOffset = 90;  // 헤더 높이에 맞게 조정 (현재 header padding 감안해서 70~90px 정도)

    // 요소의 위치 계산
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    // 최종 스크롤 위치
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

// 로고를 눌렀을 때 처음 화면으로 돌아가기
const handleLogoClick = () => {
  if (window.location.pathname === "/") {
    // 이미 메인페이지인 경우
    if (window.scrollY > 0) {
      // 스크롤이 0이 아닐 때만 부드럽게 맨 위로 이동
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  } else {
    // 다른 페이지에서는 홈으로 이동
    window.location.href = "/";
  }
};

// path이동 및 스크롤 이동
// 다른페이지에서 클릭 시 메인페이지 이동 후 해당 섹션으로 이동.

const goToSection = async (sectionId) => {
  closeMenu();

  if (route.path !== "/") {
    await router.push({ path: "/", hash: `#${sectionId}` });
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 300);
  } else {
    scrollToSection(sectionId);
  }
};

// 마이페이지 이동 (로그인 체크)
const goMyPage = () => {
  closeMenu(); // 모바일 메뉴 닫기

  if (loggedInUser.value) {
    // ✅ 로그인 상태면 마이페이지로 이동
    router.push("/mypage");
  } else {
    // ❌ 로그아웃 상태면 알림 띄우고 로그인 페이지로 이동
    alert("로그인이 필요한 서비스입니다.");
    router.push("/login");
  }
};

// ✅ 로그인/로그아웃 직접 수행 시 바로 반영되도록 함수 수정
const login = () => {
  // 실제 로그인 로직 대신 예시용 (테스트용 더미)
  localStorage.setItem("loggedInUser", JSON.stringify({ name: "user" }));
  checkedLogin(); // 즉시 반영
};

// logout
const logout = () => {
  localStorage.removeItem("loggedInUser");
  window.dispatchEvent(new Event("storage"));
  checkedLogin(); // 즉시 반영
  alert("로그아웃 되었습니다!");
};

// 언어 변경
const { locale, t } = useI18n();
// 둘다 없으면 기본 언어를 사용하기 (기본값 : ko)
const currentLang = ref(locale.value || localStorage.getItem("language") || "ko");
// 언어변경 함수
const onChangeLang = () => {
  // locale.value를 현재 선택된 언어로 변경
  locale.value = currentLang.value;
  // 선택된 언어를 브라우저 localStorage에 저장 하기
  localStorage.setItem("language", currentLang.value);
};
</script>

<style lang="scss" scoped>
@use "../assets/variables" as *;

header {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 90;
  // max-width: 1000px;
  // padding: 15px 20px;
  padding: 15px 0;
  background-color: transparent;
  transition: all 0.3s;
  z-index: 999999;

  // 홈페이지 외 헤더 색상 지정하기
  &.not-home {
    position: relative;
    background-color: $point-color;

    a {
      color: #fff;
    }

    .header-logo img {
      filter: brightness(0) invert(1);
    }
  }

  // 스크롤하면
  &.scrolled {
    background-color: $point-color;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    a {
      color: #fff;
    }

    .header-logo img {
      filter: brightness(0) invert(1);
    }
  }

  // isDark dark가 더해지면
  &.dark {
    background-color: $font-color;

    a {
      color: #fff;
    }

    .header-logo img {
      filter: brightness(0) invert(1);
    }
  }

  .inner {
    width: 85%;
    max-width: 1000px;
    display: flex;
    margin: auto;
    justify-content: space-between;
    align-items: center;

    .header-logo img {
      width: 70px;
      display: block;
      cursor: pointer;
    }

    .header-menu {
      display: flex;
      gap: 35px;
      font-size: $notice-text-font;
    }

    .header-loginMenu {
      display: flex;
      gap: 25px;
      font-size: $notice-text-font;
    }
    a {
      color: #fff;
    }
    .user-logform-logout {
      display: flex;
      gap: 25px;
    }
  }

  // 모바일 레이아웃
  .user-buttons {
    display: none; // 기본적으로 숨김
    gap: 8px;
    align-items: center;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25px;
      height: 25px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .mypageIcon,
    .loginIcon {
      width: 25px;
      margin: 10px 8px;
      img {
        width: 100%;
      }
    }
    .logoutIcon {
      margin: 0 10px;
    }
  }
  .hamburger {
    display: none;
    background: transparent;
    border: 0;
    padding: 8px;
    cursor: pointer;
    .line {
      width: 25px;
      height: 2px;
      background-color: $bg-color;
      margin: 8px 0;
      border-radius: 2px;
      transition: all 0.3s;
    }
    &.active .line:nth-child(1) {
      transform: translateY(9px) rotate(45deg);
    }
    &.active .line:nth-child(2) {
      opacity: 0;
    }
    &.active .line:nth-child(3) {
      transform: translateY(-11px) rotate(-45deg);
    }
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 300px;
    background: #fff;
    color: $font-color;
    font-size: $notice-text-font;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 9;
    padding: 50px 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: space-between;

    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: 25px;
      a {
        color: $font-color;
        text-decoration: none;
        padding: 14px 8px;
      }
    }
    .mobile-login {
      display: flex;
      // gap: 16px;
      a {
        color: $font-color;
        text-decoration: none;
        padding: 14px 8px;
      }
    }
    &.open {
      transform: translateX(0);
    }
  }

  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: 8;
    &.open {
      opacity: 1;
      pointer-events: auto;
    }
  }

  #lang{
    // background-color: #fff;
    border-radius: 5px;
    border: none;
    color: #fff;
  }
  #lang option{
    color: #333;
  }

  @media (max-width: 1000px) {
    .user-buttons {
      display: flex;
    }

    .hamburger {
      display: block;
    }
    :deep(.header-menu),
    :deep(.header-loginMenu) {
      display: none !important;
    }
  }
}
</style>
