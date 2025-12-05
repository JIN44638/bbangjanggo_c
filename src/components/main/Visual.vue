<template>
  <div class="visual">
    <div class="visual-txt" :class="{ 'locale-ja': locale === 'ja' }">
      <h1 :class="{ 'font-ja': locale === 'ja' }">
        {{ t("visual.line1") }}<br />
        {{ t("visual.line2") }}
      </h1>
      <div class="reserBtn">
        <RouterLink to="/reservation" class="btn btn-direct">
          <div class="btn-content">
            <span class="btn-text">
              {{ t("visual.pickup1") }}<br />
              {{ t("visual.pickup2") }}</span
            >
            <div class="btn-image"></div>
          </div>
        </RouterLink>
        <RouterLink to="/reservation" class="btn btn-delivery">
          <div class="btn-content">
            <span class="btn-text">
              {{ t("visual.delivery1") }}<br />
              {{ t("visual.delivery2") }}</span
            >
            <div class="btn-image"></div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";

const { locale, t } = useI18n();
</script>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.visual {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/public/images/kms/main-img.png") center/cover no-repeat;

  .visual-txt {
    // background-color: red;
    width: 80%;
    max-width: 1000px;
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translateX(-50%);
    @media (max-width: 400px) {
      max-width: 500px;
      top: 25%;
    }
    h1 {
      font-family: "Cafe24Surround";
      // font-family: "SpokaHanSansNeo";
      font-weight: bold;
      color: white;
      font-size: 48px;
      z-index: 1;
      // padding-top: 40%;

      // 일본어일 때는 일본어를 지원하는 폰트 사용
      &.font-ja {
        font-family: "SpokaHanSansNeo", "Hiragino Kaku Gothic ProN",
          "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif;
      }
    }

    .reserBtn {
      width: 100%;
      display: flex;
      gap: 20px;
      padding-top: 15%;
      // margin-top: 15%;
      // margin-bottom: 14%;
      @media (max-width: 830px) {
        padding-top: 50px;
      }

      .btn {
        &:hover {
          // 버튼 애니메이션 호버 시 멈추기
          :deep(.btn-image) {
            animation-play-state: paused !important;
          }
        }
        // width: 300px
        flex: 1;
        height: 150px;
        border-radius: 20px;
        background-color: rgba(186, 142, 95, 0.8);
        text-decoration: none;
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
        transition: all 0.5s;
        &:hover {
          // transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          // background-color: darken($color: $point-color, $amount: 10);
          background-color: rgb(150, 110, 68);
          // .btn-content {
          //   .btn-image {
          //     transform: scale(1.02);
          //     width: 150px;
          //     height: 150px;
          //   }
          // }
        }

        .btn-content {
          // position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          height: 170px;
          padding: 0 50px;
          @media (max-width: 980px) {
            padding: 0 30px;
          }
          @media (max-width: 390px) {
            padding: 0 20px;
          }
          .btn-text {
            font-family: "Cafe24Surround";
            color: $bg-color;
            font-size: $sub-font;
            font-weight: bold;
            line-height: 1.2;
            flex: 1;
            @media (max-width: 390px) {
              font-size: $f-a-q-text-font;
            }
          }

          .btn-image {
            // position: absolute;
            // top: 50%;
            // right: 50px;
            // transform: translateY(-50%);
            transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
            width: 160px;
            height: 140px;
            flex-shrink: 0;
            /* 버튼 흔들리는 애니메이션 */
            animation: swing 1s ease-in-out infinite alternate;
            transform-origin: center center;
          }
        }
      }

      .btn-direct {
        .btn-image {
          background: url(/images/kms/self.png) center/contain no-repeat;
        }
      }

      .btn-delivery {
        .btn-image {
          background: url(/images/kms/delivery.png) center/contain no-repeat;
        }
      }
    }

    // 일본어일 때 btn-text 폰트 적용
    &.locale-ja {
      .reserBtn {
        .btn {
          .btn-content {
            .btn-text {
              font-family: "SpokaHanSansNeo", "Hiragino Kaku Gothic ProN",
                "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 830px) {
  .visual {
    .visual-txt {
      h1 {
        font-size: 30px;
      }
    }
  }

  .reserBtn {
    flex-direction: column;
  }
}
@media (max-width: 390px) {
  .visual {
    .visual-txt {
      h1 {
        font-size: $mobile-title-font;
      }
    }
  }

  // :deep(.btn-content).btn-image {
  //   right: 10px;
  // }
}
/* 흔들림 keyframes */
@keyframes swing {
  0% {
    transform: rotate(-7deg);
  }
  100% {
    transform: rotate(7deg);
  }
}
</style>
