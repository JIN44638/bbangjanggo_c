import Login from "@/views/Login.vue";
import Mypage from "@/views/Mypage.vue";
import { createI18n } from "vue-i18n";

// 번역 더미 데이터
// 한국어 번역
const ko = {
  lang: {
    label: "언어",
    ko: "한국어",
    en: "English",
    ja: "日本語",
  },
  header: {
    home: "홈",
    reserve: "예약하기",
    location: "지점안내",
    howto: "이용방법",
    price: "요금안내",
    faq: "FAQ|문의",
  },
  status: {
    login: "로그인",
    logout: "로그아웃",
    signup: "회원가입",
    mypage: "마이페이지",
  },
  visual: {
    line1: "빵은 저희에게 맡기고",
    line2: "편히 여행하세요",
    pickup1: "직접",
    pickup2: "맡길게요",
    delivery1: "기사님께",
    delivery2: "맡길게요",
  },
};

// 영어 번역
const en = {
  lang: {
    label: "Language",
    ko: "한국어",
    en: "English",
    ja: "日本語",
  },
  header: {
    home: "Home",
    reserve: "Reserve",
    location: "Locations",
    howto: "How to Use",
    price: "Pricing",
    faq: "FAQ",
  },
  status: {
    login: "Login",
    logout: "Logout",
    signup: "Sign Up",
    mypage: "My Page",
  },
  visual: {
    line1: "Leave your luggage to us",
    line2: "and travel comfortably",
    pickup1: "Drop off",
    pickup2: "in person",
    delivery1: "Delivery",
    delivery2: "service",
  },
};

// 일본어 번역
const ja = {
  lang: {
    label: "言語",
    ko: "한국어",
    en: "English",
    ja: "日本語",
  },
  header: {
    home: "ホーム",
    reserve: "予約する",
    location: "店舗案内",
    howto: "利用方法",
    price: "料金案内",
    faq: "FAQ|お問い合わせ",
  },
  status: {
    login: "ログイン",
    logout: "ログアウト",
    signup: "会員登録",
    mypage: "マイページ",
  },
  visual: {
    line1: "荷物はお任せください",
    line2: "快適な旅行を",
    pickup1: "直接",
    pickup2: "預ける",
    delivery1: "配達",
    delivery2: "サービス",
  },
};

// i18n 인스턴스 생성
const i18n = createI18n({
  legacy: false, //Composition API 사용 여부 (현재 사용안함 상태)
  locale: localStorage.getItem("language") || "ko", //기본 언어 설정
  fallbackLocale: "ko", //번역이 없을 경우 사용할 언어
  messages: {
    ko,
    en,
    ja,
  },
});
export default i18n;
