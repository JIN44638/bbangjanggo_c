<template>
  <div class="price">
    <h2 :class="{ 'font-ja': locale === 'ja' }">{{ t("price.title") }}</h2>
    <div class="inner p_inner">
      <div class="notice_wrap">
        <div class="notice">
          <h3>{{ t("price.pickup") }}</h3>
          <div class="info">
            <div class="box">
              <p>{{ t("price.refrigerated") }}</p>
              <p>{{ t("price.pickupRefrigerated") }}</p>
            </div>
            <div class="box">
              <p>{{ t("price.roomTemp") }}</p>
              <p>{{ t("price.pickupRoom") }}</p>
            </div>
            <div class="box">
              <p>{{ t("price.overtime") }}</p>
              <p>{{ t("price.overtimeRate") }}</p>
            </div>
            <div class="box">
              <p>{{ t("price.maxTime") }}</p>
              <p>{{ t("price.maxHours") }}</p>
            </div>
          </div>
        </div>

        <div class="notice">
          <h3>{{ t("price.delivery") }}</h3>
          <div class="info">
            <div class="box">
              <p>{{ t("price.refrigerated") }}</p>
              <p>{{ t("price.deliveryRefrigerated") }}</p>
            </div>
            <div class="box">
              <p>{{ t("price.roomTemp") }}</p>
              <p>{{ t("price.deliveryRoom") }}</p>
            </div>
            <div class="box">
              <p>{{ t("price.overtime") }}</p>
              <p>{{ t("price.overtimeRate") }}</p>
            </div>
            <div class="box">
              <p>{{ t("price.maxTime") }}</p>
              <p>{{ t("price.maxHours") }}</p>
            </div>
          </div>
        </div>
      </div>
      <span :class="{ 'font-ja': locale === 'ja' }">{{ t("price.additional") }}</span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();
</script>
<style lang="scss" scoped>
@use "/src/assets/variables" as *;

.price {
  position: relative;
  background-color: $bg-color;
  padding-bottom: 50px;
  padding-top: 50px;
  text-align: center;
  h2 {
    text-align: center;
    font-family: "Cafe24Surround";
    margin-bottom: 50px;
    color: #a36031;
    font-size: 32px;
    @media (max-width: 768px) {
      margin-bottom: 40px;
    }
    @media (max-width: 390px) {
      font-size: 20px;
      margin-bottom: 30px;
    }
    font-weight: bold;
    // 일본어일 때는 일본어를 지원하는 폰트 사용
    &.font-ja {
      font-family: "SpokaHanSansNeo", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif;
    }
  }
  .notice_wrap {
    // display: flex;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    // flex-wrap: wrap;
    gap: 4%;
    padding-bottom: 20px;

    h3 {
      width: 100%;
      border: solid $point-color;
      border-radius: 15px 15px 0 0;
      background-color: $point-color;
      text-align: center;
      padding: 10px 0;
      font-weight: bold;
      color: #fff8f8;
      @media (max-width: 390px) {
        font-size: 16px;
      }
    }

    .box {
      // padding-bottom: 21px;
      display: flex;

      font-size: $desc-text-font;
      font-weight: bold;
      justify-content: space-between;
      @media (max-width: 768px) {
        font-size: 14px;
        font-weight: normal;
      }
      p {
        @media (max-width: 390px) {
          font-size: 13px;
        }
      }
    }
    .notice {
      /* height: 170px; */
      background-color: #ffffff;

      border-radius: 15px;
    }

    .info {
      padding: 10%;
      display: flex;
      flex-direction: column;
      gap: 15px;
      @media (max-width: 768px) {
        padding: 10%;
        // padding-bottom: 5%;
      }
      @media (max-width: 390px) {
        padding: 8%;
      }
    }
  }
  span {
    color: #50311d;
    font-weight: bold;
    padding-top: 30px;

    text-align: center;
    font-size: 16px;
    @media (max-width: 768px) {
      font-size: 12px;
      font-weight: normal;
    }
  }
}
@media (max-width: 768px) {
  .price {
    padding-bottom: 40px;
    padding-top: 40px;
  }
}
</style>
