<template>
  <div class="price">
    <h2>요금 안내</h2>
    <div class="inner p_inner">
      <div class="notice_wrap">
        <div class="notice">
          <h3>직접 맡길게요</h3>
          <div class="info">
            <div class="box">
              <p>냉장실</p>
              <p>3000원</p>
            </div>
            <div class="box">
              <p>상온</p>
              <p>2500원</p>
            </div>
            <div class="box">
              <p>4시간 초과시</p>
              <p>300원/10분당</p>
            </div>
            <div class="box">
              <p>최대보관시간</p>
              <p>24시간</p>
            </div>
          </div>
        </div>

        <div class="notice">
          <h3>기사님께 맡길게요</h3>
          <div class="info">
            <div class="box">
              <p>냉장실</p>
              <p>4,000원</p>
            </div>
            <div class="box">
              <p>상온</p>
              <p>3,000원</p>
            </div>
            <div class="box">
              <p>4시간 초과시</p>
              <p>300원/10분당</p>
            </div>
            <div class="box">
              <p>최대보관시간</p>
              <p>24시간</p>
            </div>
          </div>
        </div>
      </div>
      <span>보냉백 (+1000) / 아이스팩 (+1,000) 별도</span>
    </div>
  </div>
</template>

<script setup></script>
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
      border: solid #ba8e5f;
      border-radius: 15px 15px 0 0;
      background-color: #ba8e5f;
      text-align: center;
      padding: 10px 0;
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
