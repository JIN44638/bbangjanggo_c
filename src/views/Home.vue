<template>
  <div class="home">
    <section id="visual" class="section"><Visual /></section>
    <FlowAd />

    <section id="location" class="location">
      <h1 :class="{ 'font-ja': locale === 'ja' }">{{ t("location.title") }}</h1>
      <Location :showPins="true" />
    </section>

    <section id="howto" class="section"><Howto /></section>
    <section id="price" class="section">
      <Price />
    </section>
    <section id="event" class="section"><Event /></section>
    <section id="review" class="section"><Review /></section>
    <section id="faq" class="section"><Faq /></section>
  </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();
import Location from "@/components/main/Location.vue";
import Visual from "@/components/main/Visual.vue";
import Howto from "@/components/main/Howto.vue";
import Price from "@/components/main/Price.vue";
import Event from "@/components/main/Event.vue";
import Review from "@/components/main/Review.vue";
import Faq from "@/components/main/Faq.vue";
import FlowAd from "@/components/FlowAd.vue";
</script>

<style lang="scss" scoped>
@use "/src/assets/variables" as *;

.location {
  padding: 50px 0;
  h1 {
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
    h1 {
      padding-bottom: 40px;
    }
  }
  @media (max-width: 390px) {
    h1 {
      padding-bottom: 30px;
      font-size: $f-a-q-text-font;
    }
  }
}

@media (max-width: 768px) {
  .location {
    padding: 40px 0;
  }
}
@media (max-width: 390px) {
  .location {
    padding: 30px 0;
  }
}
</style>
