<template>
  <div class="quick">
    <div class="btnwrap">
      <!-- 맨 위로 버튼 -->
      <a v-show="show" class="quick-top" @click="gotop">
        <img src="/images/pjs/gotop3.png" alt="맨위로가기" />
      </a>

      <!-- ellipsis 버튼 -->
      <a class="ellipsis" @click="toggleExpand" >
        <img :src="currentEllipsis" alt="ellipsis" />
      </a>

      <!-- 나머지 버튼 3개 -->
      <!-- <a class="sub-btn" @click="goPage('/mypage')">
        <img src="/images/pjs/reservation.png" alt="reservation" />
        <span>예약하기</span>
      </a> -->
      <a class="sub-btn" @click="goPage('/mypage')">
        <img src="/images/pjs/confirm.png" alt="confirm" />
        <span>예약확인</span>
      </a>
      <a href="#faq" @click.prevent="goToSection('faq')" class="sub-btn">
        <img src="/images/pjs/contact.png" alt="contact" />
        <span>문의하기</span>
      </a>
      <a href="#location" @click.prevent="goToSection('location')" class="sub-btn">
        <img src="/images/pjs/search.png" alt="search" />
        <span> 지점찾기</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

const route = useRoute();

// gotop 표시 여부
const show = ref(false);
// 스크롤 상태
const isScrolled = ref(false);
// ellipsis 클릭 시 확장 여부
const isExpanded = ref(true);

// 스크롤 이벤트
const handleScroll = () => {
  const y = window.scrollY;
  show.value = y > 200;
  isScrolled.value = y > 200;
};

// gotop 동작
const gotop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ellipsis 클릭 시 3개 버튼 숨기기/보이기
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  const subBtns = document.querySelectorAll(".sub-btn");
  subBtns.forEach((btn) => {
    btn.style.display = isExpanded.value ? "flex" : "none";
  });
};

// ellipsis 이미지 변경 (메인페이지에서만 스크롤에 따라 변경, 다른 페이지는 갈색 고정)
const currentEllipsis = computed(() => {
  // 메인페이지가 아닌 경우 항상 갈색
  if (route.path !== "/") {
    return "/images/pjs/ellipsis5.png";
  }
  // 메인페이지인 경우 스크롤 상태에 따라 변경
  return isScrolled.value ? "/images/pjs/ellipsis5.png" : "/images/pjs/ellipsis-white.png";
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// 페이지 이동 시 색상 초기화
onBeforeRouteLeave(() => {
  isScrolled.value = false; // 페이지 이동 시 색상 초기화
});
// 페이지이동
const router = useRouter();

const goPage = (path) => {
  // console.log(path);
  // 페이지 이동
  router.push(path);
  // emit("close"); // emit이 정의되지 않았으므로 제거
};

// 스크롤이동 적용하기
const scrollToSection = (sectionId) => {
  console.log(`스크롤 이동 시도: ${sectionId}`); // 디버깅용 로그 추가
  const element = document.getElementById(sectionId);
  const header = document.querySelector("header"); // header 요소를 직접 참조

  if (element) {
    console.log("요소를 찾았습니다:", element); // 디버깅용 로그 추가
    const headerOffset = header ? header.offsetHeight : 90;
    // const headerOffset = 90;  // 헤더 높이에 맞게 조정 (현재 header padding 감안해서 70~90px 정도)

    // 요소의 위치 계산
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    // 최종 스크롤 위치
    const offsetPosition = elementPosition - headerOffset;

    console.log(`스크롤 위치: ${offsetPosition}`); // 디버깅용 로그 추가

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  } else {
    console.log(`요소를 찾을 수 없습니다: ${sectionId}`); // 디버깅용 로그 추가
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
  console.log(`goToSection 호출됨: ${sectionId}`); // 디버깅용 로그 추가

  if (route.path !== "/") {
    console.log("메인페이지가 아니므로 메인페이지로 이동");
    await router.push({ path: "/", hash: `#${sectionId}` });
    setTimeout(() => {
      scrollToSection(sectionId);
    }); // 시간을 늘려서 페이지 로딩 완료 후 실행
  } else {
    console.log("메인페이지에서 스크롤 이동");
    // DOM이 완전히 렌더링된 후 실행되도록 nextTick 사용
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 100);
  }
};
</script>

<style lang="scss" scoped>
@use "/src/assets/variables" as *;
.quick {
  position: relative;
  .btnwrap {
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 10;
    gap: 7px;
    align-items: center;
    @media (max-width: 768px) {
      position: fixed;
      bottom: 15px;
      right: 15px;
    }
  }

  .quick-top {
    width: 30px;
    height: 30px;
    box-shadow: none;
  }

  a {
    position: relative;
    width: 42px;
    height: 42px;
    font-size: 20px;
    cursor: pointer;
    border: none;
    background: transparent;
    border-radius: 50%;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.25);
    transition: all 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
    }

    span {
      // display: none;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 55px;
      font-size: $mobile-notice-font;
      width: max-content;
      min-width: 60px;
      background-color: $font-color;
      color: #fff;
      padding: 8px 12px;
      border-radius: 10px;
      z-index: 20;
      white-space: nowrap;

      /* 말풍선 꼬리 */
      // &::after {
      //   content: "";
      //   position: absolute;
      //   top: 50%;
      //   right: -6px;
      //   transform: translateY(-50%);
      //   width: 0;
      //   height: 0;
      //   border-top: 6px solid transparent;
      //   border-bottom: 6px solid transparent;
      //   border-left: 6px solid $font-color;
      // }
    }

    // &:hover span {
    //   display: block;
    // }
  }


  .ellipsis {
    width: 37px;
    height: 37px;
  }

  /* 📱 모바일일 때만 ellipsis 클릭 시 나머지 버튼 숨김/보임 */
  // @media (max-width: 768px) {
  //   .sub-btn {
  //     display: none;
  //   }
  // }
}
</style>
