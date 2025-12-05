<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  
  <footer>
    <div class="inner foot-inner">
      <div class="logo">
        <img src="/images/kms/foot_logo.png" alt="logo" />
      </div>
      <div class="footer-right">
        <div class="footer-text">
          <p class="footer-text-title">주식회사 빵장고</p>
          <p>대구 중구 중앙대로 394 TEL.053-568-5857</p>
          <p>사업자등록번호 : 504-85-25999</p>
          <div class="copy-wrap">
            <span class="copy">&copy; 빵장고 2025 All Rights Reserved.</span>
            <span class="copy created">Created by PJS PJE KMS and KMJ.</span>
          </div>
        </div>

        <div class="footer-icon">
          <div class="android icon">
            <img src="/images/pjs/googleplay.png" alt="안드로이드" />
            <p>Android 전용</p>
          </div>
          <div class="iso icon">
            <img src="/images/pjs/apple.png" alt="ios" />
            <p>ios 전용</p>
          </div>
          <div class="sns">
            <i class="fa-brands fa-twitter"></i>
            <i class="fa-brands fa-facebook-f"></i>
            <i class="fa-brands fa-instagram"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="thum">
      <img src="/images/pjs/thum.jpg" alt="섬네일">
    </div> -->
  </footer>
</template>

<script setup></script>

<style lang="scss" scoped>
@use "/src/assets/variables" as *;

footer {
  background-color: $bg-color;
  padding: 40px 0;

  .foot-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3%;
    flex-wrap: wrap;
    width: 85%;
    .logo {
      width: 15%;
      min-width: 150px;
      img {
        width: 100%;
      }
    }
    .footer-right {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
      .footer-text {
        color: $sub-color;
        font-family: "SpokaHanSansNeo";
        font-size: $mobile-notice-font;
        font-weight: 300;

        p {
          padding-bottom: 5px;
        }

        .footer-text-title {
          font-weight: 500;
          padding-bottom: 5px;
        }

        .copy-wrap {
          display: flex;
          flex-wrap: nowrap;
          gap: 10px;

          .copy {
            font-size: $mobile-notice-font;
          }
          @media (max-width: 390px) {
            .copy {
              font-size: 10px;
            }
          }
        }
      }
      @media (max-width: 390px) {
        .footer-text {
          font-size: 10px;
        }
      }
      .footer-icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        .sns {
          width: 100%;
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: flex-start;
          padding-top: 8px;
          color: $sub-color;
          font-size: 16px;
          // padding-top: 5px;

          img {
            height: 20px;
            // height: clamp(16px, 2.6vw, 24px);
            width: auto;
            flex: 0 1 auto;
          }
        }
      }

      .icon {
        width: 110px;
        background-color: $sub-color;
        display: flex;
        padding: 3px 5px;
        border-radius: 7px;
        align-items: center;
        gap: 5px;

        img:first-child {
          width: 20px;
        }

        p {
          color: #fff;
          font-family: "SpokaHanSansNeo";
          font-size: $mobile-notice-font;
          font-weight: 100;
        }
      }

      .icon:first-child {
        margin-bottom: 5px;
      }
    }
  }
}

/* ✅ 반응형: copy 문장만 줄바꿈 */
@media screen and (max-width: 768px) {
  .footer-text {
    .copy-wrap {
      flex-direction: column; /* 👈 두 문장만 세로로 */
      align-items: flex-start;
      gap: 3px;

      .copy {
        display: block;
      }
    }
  }
}
@media screen and (max-width: 560px) {
  .footer-text {
    padding: 20px 0;
  }
}
@media screen and (max-width: 400px) {
  .footer-right {
    display: flex;
    flex-direction: column;
    .footer-icon {
      // align-items: flex-end;
      align-items: flex-start;
      .sns {
        width: 110px !important;
        gap: 5px !important;
        align-items: center !important;
        justify-content: flex-start !important;
        padding: 0 !important;
        padding-top: 10px !important;
      }
    }
  }
}
</style>
