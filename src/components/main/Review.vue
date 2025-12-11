<template>
  <section class="review">
    <div class="reviewinner">
      <h3 :class="{ 'font-ja': locale === 'ja' }">{{ t("review.title") }}</h3>
      <div class="review-container">
        <!-- 왼쪽 화살표 -->
        <div class="swiper-button-prev"></div>

        <div class="review-swiper">
          <!-- Swiper 컴포넌트 -->
          <swiper
            class="reviewSwiper"
            :modules="[Autoplay, Navigation]"
            :slides-per-view="2.3"
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
              550: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
            }">
            <swiper-slide v-for="review in reviews" :key="review.id">
              <div class="review-card">
                <div class="review-image">
                  <img :src="review.image" :alt="`${t('review.imageAlt')} ${review.id}`" loading="lazy" />
                </div>
                <div class="review-content">
                  <div class="review-rating">
                    <span v-for="star in review.rating" :key="star" class="star">★</span>
                  </div>
                  <p class="review-text">{{ t(review.textKey) }}</p>
                  <p class="review-author">{{ review.author }}</p>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>

        <!-- 오른쪽 화살표 -->
        <div class="swiper-button-next"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();

import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";

// 리뷰 데이터
const reviews = ref([
  {
    id: 1,
    image: "/images/pjs/review11.jpg",
    textKey: "review.text1",
    rating: 5,
    author: "apo****",
  },
  {
    id: 2,
    image: "/images/pjs/review12.jpg",
    textKey: "review.text2",
    rating: 4,
    author: "ros****",
  },
  {
    id: 3,
    image: "/images/pjs/review13.jpg",
    textKey: "review.text3",
    rating: 5,
    author: "liy****",
  },
  {
    id: 4,
    image: "/images/pjs/review14.PNG",
    textKey: "review.text4",
    rating: 5,
    author: "kim****",
  },
  {
    id: 5,
    image: "/images/pjs/review15.PNG",
    textKey: "review.text5",
    rating: 4,
    author: "lee****",
  },
  {
    id: 6,
    image: "/images/pjs/review16.jpg",
    textKey: "review.text6",
    rating: 5,
    author: "park****",
  },
]);
</script>

<style lang="scss" scoped>
@use "/src/assets/variables" as *;
.review {
  padding-top: 50px;
  padding-bottom: 50px;
  background-color: $bg-color;
}
@media (max-width: 768px) {
  .review {
    padding-top: 40px;
    padding-bottom: 40px;
  }
}
@media (max-width: 390px) {
  .review {
    padding-top: 30px;
    padding-bottom: 30px;
  }
}
.reviewinner {
  position: relative;
  margin: auto;
  max-width: 1200px;
  width: 100%;
  padding: 0 60px;

  @media (max-width: 1023px) {
    padding: 0 20px;
  }
  h3 {
    text-align: center;
    font-size: $title-font;
    font-family: "Cafe24Surround";
    color: $point-color;
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
}

.review-container {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;

  @media (max-width: 1023px) {
    gap: 10px;
  }
}

.review-swiper {
  flex: 1;
  position: relative;
  overflow: hidden;
  padding: 10px 5px 20px 5px;
}

.reviewSwiper {
  overflow: visible;
}

.swiper-slide {
  height: auto;
}

.review-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 350px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.review-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.review-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  justify-content: space-between;
}

.review-rating {
  display: flex;
  gap: 2px;

  .star {
    color: #ffd700;
    font-size: 18px;
  }
}

.review-text {
  font-size: 13px;
  color: #333;
  line-height: 1.5;
  margin: 0;
}

.review-author {
  font-size: 12px;
  color: #666;
  text-align: right;
  margin: 0;
  margin-top: auto;
  font-weight: 500;
}

/* 네비게이션 버튼을 슬라이드 양쪽에 배치 */
.swiper-button-prev,
.swiper-button-next {
  position: static;
  color: $font-color;
  border-radius: 50%;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  transition: background-color 0.3s ease;
}

/* 화살표 아이콘 크기 */
.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 16px !important;
}

/* 비활성화 상태 */
.swiper-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 550px 이하에서 간격 조정 */
@media (max-width: 550px) {
  .review-content {
    padding: 5px;
    gap: 2px;
  }

  .review-text {
    font-size: 11px;
    line-height: 1.4;
  }

  .review-rating .star {
    font-size: 14px;
  }

  .review-author {
    font-size: 11px;
  }
}

/* 모바일에서 화살표 숨기기 */
@media (max-width: 767px) {
  .swiper-button-prev,
  .swiper-button-next {
    display: none;
  }

  .review-container {
    gap: 0;
  }

  .review-card {
    height: 300px;
  }

  .review-image {
    height: 170px;
  }

  .review-content {
    padding: 12px;
    gap: 6px;
  }

  .review-text {
    font-size: 12px;
  }

  .review-rating .star {
    font-size: 16px;
  }
}
@media (max-width: 390px) {
  .review-author {
    font-size: 10px;
  }

  .review-text {
    font-size: 11px;
  }
}
</style>
