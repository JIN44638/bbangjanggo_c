<template>
  <div class="notFound">
    <div class="img-404"><img src="/images/kms/error_point-logo.gif" alt="로고" /></div>
    <div class="txt-404">
      <h1>404</h1>
      <p>이 페이지는 없는 페이지 입니다.</p>
      <router-link to="/"><p class="home-link">홈으로 돌아가기 ></p></router-link>
    </div>
  </div>
</template>
<style scoped>
.notFound {
  width: 100%;
  height: calc(100vh - 89.77px - 167px);
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 251, 242, 1);
}
.img-404 {
  width: 250px;
}
.notFound > img {
  display: block;
  width: 100%;
}
.txt-404 {
  height: 200px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
}
h1 {
  font-family: "Cafe24Surround";
  font-size: 70px;
  color: rgba(80, 49, 29, 1);
  line-height: 70px;
}
p {
  font-family: "SpokaHanSansNeo";
  font-size: 24px;
  color: rgba(80, 49, 29, 1);
}
.home-link {
  font-size: 16px;
}
</style>
