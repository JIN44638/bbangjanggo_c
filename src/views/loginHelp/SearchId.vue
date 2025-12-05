<template>
  <FlowAd/>
  <div class="searchId">
    <div class="searchId-inner">
      <h2>아이디 찾기</h2>
      <div class="infoBox">
        <p>성함</p>
        <input type="text" placeholder="한글 또는 영어 이름을 입력해주세요" />
      </div>
      <div class="infoBox-a">
        <p>휴대폰 번호</p>
        <div class="info-txt-box">
          <input type="text" placeholder="010-1234-5678" />
          <button>인증번호</button>
        </div>
      </div>
      <div class="infoBox">
        <p>인증번호 입력</p>
        <input type="text" placeholder="인증번호 6자리 입력" />
      </div>
      <router-link to="/login"><button class="submitBtn">다음</button></router-link>
    </div>
  </div>
</template>
<script setup>
import FlowAd from '@/components/FlowAd.vue';

</script>
<style scoped lang="scss">
@use "/src/assets/variables" as *;
@use "/src/assets/btn" as *;

.searchId {
  background-color: $bg-color;
  height: calc(100vh - 115px);
  .searchId-inner {
    max-width: 400px;
    width: 85%;
    padding: 50px 0;
    margin: auto;
    h2 {
      font-family: "Cafe24Surround";
      color: $point-color;
      font-size: $sub-font;
      text-align: center;
      margin-bottom: 40px;
    }
    .infoBox {
      p {
        font-size: $desc-text-font;
        color: $font-color;
        font-weight: bold;
        margin-bottom: 5px;
      }
      input {
        width: 100%;
        background-color: #fff;
        border: none;
        box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 20px 30px;
        margin-bottom: 20px;
      }
    }
    .infoBox-a {
      p {
        font-size: $desc-text-font;
        color: $font-color;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .info-txt-box {
        display: flex;
        margin-bottom: 20px;
        gap: 10px;
        input {
          width: 70%;
          background-color: #fff;
          border: none;
          box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 20px 30px;
        }
        button {
          width: 30%;
        }
      }
    }
    button {
      @include btn-style;
      height: 59px;
    }
  }
}
.submitBtn {
  margin: 20px 0 0 0;
}
</style>
