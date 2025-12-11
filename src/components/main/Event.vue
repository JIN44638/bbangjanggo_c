<template>
  <section class="event">
    <div class="inner">
      <h3 :class="{ 'font-ja': locale === 'ja' }">{{ t("promotion.title") }}</h3>
      <div class="event-swiper">
        <!-- Swiper 컴포넌트 -->
        <swiper
          class="eventSwiper"
          :modules="[Autoplay, Pagination, Navigation]"
          :slides-per-view="1.5"
          :space-between="10"
          :autoplay="{
            delay: 2500,
            disableOnInteraction: false,
          }"
          :navigation="{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }"
          :loop="true"
          :breakpoints="{
            450: {
              slidesPerView: 2.2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
          }">
          <swiper-slide>
            <img src="/images/pje/welcomeEvent.png" alt="slide" />
          </swiper-slide>
          <swiper-slide>
            <img src="/images/pje/banner_breadtime.png" alt="slide" />
          </swiper-slide>
          <swiper-slide>
            <img src="/images/pje/banner_stamp.png" alt="slide" />
          </swiper-slide>
          <swiper-slide>
            <img src="/images/pje/banner_festival.png" alt="slide" />
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </section>
</template>

<script setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
</script>

<style lang="scss" scoped>
@use "/src/assets/variables" as *;
.event {
  padding-top: 50px;
  padding-bottom: 50px;
  background-color: $sub-color;
  h3 {
    text-align: center;
    font-size: $title-font;
    font-family: "Cafe24Surround";
    color: #fff;
    padding-bottom: 50px;
    font-weight: bold;
    // 일본어일 때는 일본어를 지원하는 폰트 사용
    &.font-ja {
      font-family: "SpokaHanSansNeo", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif;
    }
  }
  @media (max-width: 768px) {
    h3 {
      padding-bottom: 40px;
    }
  }
  @media (max-width: 390px) {
    h3 {
      font-size: $f-a-q-text-font;
      padding-bottom: 30px;
    }
  }
  img {
    width: 100%;
    display: block;
  }
}
@media (max-width: 768px) {
  .event {
    padding-top: 40px;
    padding-bottom: 40px;
  }
}
@media (max-width: 390px) {
  .event {
    padding-top: 30px;
    padding-bottom: 30px;
  }
}
.inner {
  position: relative;
  margin: auto;
}
.event-swiper {
  position: relative;
  .swiper-slide {
    border-radius: 20px;
    overflow: hidden;
  }
  @media (max-width: 768px) {
    .swiper-slide {
      border-radius: 20px;
    }
  }
  @media (max-width: 390px) {
    .swiper-slide {
      border-radius: 15px;
    }
  }
}
</style>
