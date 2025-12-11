<template>
  <div class="howto">
    <!-- 이용방법 -->
    <h1 :class="{ 'font-ja': locale === 'ja' }">{{ t("howto.title") }}</h1>
    <div class="inner">
      <!-- 웹 -->
      <div class="step1_2_3_4">
        <ul class="web">
          <li>
            <img src="/images/kmj/2.png" alt="" />
          </li>
          <li>
            <img src="/images/kmj/1.png" alt="" />
          </li>
          <li>
            <img src="/images/kmj/3.png" alt="" />
          </li>
          <li>
            <img src="/images/kmj/4.png" alt="" />
          </li>
        </ul>
      </div>
      <!-- 모바일 -->
      <div class="step1_2_3_4">
        <ul class="mobile">
          <img src="/images/kmj/howto-mobile.png" alt="모바일 이용방법" />
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();
</script>

<style lang="scss" scoped>
.howto {
  font-family: "Cafe24Surround";
  display: grid;
  background-color: #ba8e5f;
  img {
    width: 100%;
  }
  h1 {
    font-size: 30px;
    padding-top: 50px;
    padding-bottom: 50px;
    text-align: center;
      font-weight: bold;
    color: #fff;
      // 일본어일 때는 일본어를 지원하는 폰트 사용
      &.font-ja {
        font-family: "SpokaHanSansNeo", "Hiragino Kaku Gothic ProN",
          "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif;
      }
  } // width: 1000px;
}
/* 기본: PC 이미지만 보이게 */
.web {
  display: flex;
  gap: 20px; /* 칸 사이 간격 */

  justify-content: center;
  padding-bottom: 50px;
  ul {
    width: 100%;

    img {
      width: 100%;
      display: block;
    }
  }
}

.mobile {
  display: none;
}

/* 모바일 화면일 때 토글 */
@media (max-width: 768px) {
  .web {
    padding-top: 70px;
    padding-bottom: 40px;
    display: none;
  } /* PC 이미지 숨김 */
  .howto h1 {
    padding-top: 40px !important;
    padding-bottom: 40px !important;
  }
  .mobile {
    padding-bottom: 40px !important;
    .price {
      padding-top: 70px;
    }

    img {
      width: 100%;
      // padding-bottom: 40px;
    }
    display: block;
    padding-bottom: 80px;
  } /* 모바일 이미지 보여줌 */
}
@media (max-width: 390px) {
  .web {
    display: none;
  } /* PC 이미지 숨김 */
  .howto h1 {
    font-size: 20px;
    padding-top: 30px !important;
    padding-bottom: 30px !important;
  }
  .mobile {
    img {
      width: 100%;
    }
    display: block;
    padding-bottom: 30px !important;
  } /* 모바일 이미지 보여줌 */
}
</style>
