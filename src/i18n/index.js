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
  location: {
    title: "지점안내",
  },
  howto: {
    title: "이용방법",
  },
  price: {
  title: "요금안내",
  pickup: "직접 맡길게요",
  delivery: "기사님께 맡길게요",
  refrigerated: "냉장실",
  roomTemp: "상온",
  overtime: "4시간 초과시",
  overtimeRate: "300원/10분당",
  maxTime: "최대보관시간",
  maxHours: "24시간",
  pickupRefrigerated: "3000원",
  pickupRoom: "2500원",
  deliveryRefrigerated: "4,000원",
  deliveryRoom: "3,000원",
  additional: "보냉백 (+1000) / 아이스팩 (+1,000) 별도",
  },
  promotion: {
    title: "프로모션",
    event1: "WELCOME EVENTS 웰컴이벤트 참여시 쿠폰증정",
    event2: "대구 가을 축제한정 10% 할인",
    event3: "11AM / 3PM BREAD TIME SALE",
    event4: "스탬프 모으고 무료쿠폰 받자",
  },
  review: {
    title: "리뷰",
  },
  faq: {
    title: "FAQ|문의하기",
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
  location: {
    title: "Locations",
  },
  howto: {
    title: "How to Use",
  },
  price: {
    title: "Pricing",
  pickup: "Drop off in person",
  delivery: "Delivery service",
  refrigerated: "Refrigerated",
  roomTemp: "Room Temp",
  overtime: "Over 4 hours",
  overtimeRate: "₩300/10min",
  maxTime: "Max Storage",
  maxHours: "24 hours",
  pickupRefrigerated: "₩3,000",
  pickupRoom: "₩2,500",
  deliveryRefrigerated: "₩4,000",
  deliveryRoom: "₩3,000",
  additional: "Cooler bag (+₩1,000) / Ice pack (+₩1,000) separately",
  },
  promotion: {
    title: "Promotions",
    event1: "WELCOME EVENTS Get a coupon when you participate",
    event2: "Daegu Autumn Festival Limited 10% Discount",
    event3: "11AM / 3PM BREAD TIME SALE",
    event4: "Collect stamps and get a free coupon",
  },
  review: {
    title: "Reviews",
  },
  faq: {
    title: "FAQ",
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
  location: {
    title: "店舗案内",
  },
  howto: {
    title: "利用方法",
  },
  price: {
  title: "料金案内",
  pickup: "直接預ける",
  delivery: "配達サービス",
  refrigerated: "冷蔵室",
  roomTemp: "常温",
  overtime: "4時間超過時",
  overtimeRate: "300ウォン/10分",
  maxTime: "最大保管時間",
  maxHours: "24時間",
  pickupRefrigerated: "3,000ウォン",
  pickupRoom: "2,500ウォン",
  deliveryRefrigerated: "4,000ウォン",
  deliveryRoom: "3,000ウォン",
  additional: "保冷バッグ (+1,000) / アイスパック (+1,000) 別途",
  },
  promotion: {
    title: "プロモーション",
    event1: "WELCOME EVENTS ウェルカムイベント参加時クーポン進呈",
    event2: "大邱秋祭り限定10%割引",
    event3: "11AM / 3PM BREAD TIME SALE",
    event4: "スタンプを集めて無料クーポンをゲット",
  },
  review: {
    title: "レビュー",
  },
  faq: {
    title: "FAQ|お問い合わせ",
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
