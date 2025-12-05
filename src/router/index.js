import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Complete from "@/views/Complete.vue";
import Login from "@/views/Login.vue";
import Mypage from "@/views/Mypage.vue";
import Payment from "@/views/Payment.vue";
import Reservation from "@/views/Reservation.vue";
import Signup from "@/views/Signup.vue";
import SearchId from "@/views/loginHelp/SearchId.vue";
import SearchPassword from "@/views/loginHelp/SearchPassword.vue";
import Login_worker from "@/pages/Login_worker.vue";
import AdminHome from "@/pages/admin/AdminHome.vue";
import WorkerHome from "@/pages/worker/WorkerHome.vue";
import Dashboard_admin from "@/pages/admin/Dashboard_admin.vue";
import Reservation_admin from "@/pages/admin/Reservation_admin.vue";
import Worker_admin from "@/pages/admin/Worker_admin.vue";
import Settings_admin from "@/pages/admin/Settings_admin.vue";
import Dashboard_worker from "@/pages/worker/Dashboard_worker.vue";
import Notice_worker from "@/pages/worker/Notice_worker.vue";
import Jobs_worker from "@/pages/worker/Jobs_worker.vue";
import Mypage_worker from "@/pages/worker/Mypage_worker.vue";
import Signup_worker from "@/pages/worker/Signup_worker.vue";
import InfoRegister_worker from "@/pages/worker/InfoRegister_worker.vue";
import Payment_admin from "@/pages/admin/Payment_admin.vue";
import Custormer_admin from "@/pages/admin/Custormer_admin.vue";
import Notice_admin from "@/pages/admin/Notice_admin.vue";
import Notfound from "@/views/Notfound.vue";

const routes = [
  // 메인페이지
  { path: "/", component: Home },
  { path: "/complete", component: Complete },
  { path: "/login", component: Login },
  { path: "/mypage", component: Mypage },
  { path: "/payment", component: Payment },
  { path: "/reservation", component: Reservation },
  { path: "/signup", component: Signup },
  { path: "/searchid", component: SearchId, meta: { hideFooter: true } },
  { path: "/searchPass", component: SearchPassword, meta: { hideFooter: true } },

  // 404
    { path: "/:pathMatch(.*)*" , component:Notfound, name: "NotFound"},

  // 관리자 및 기사 로그인 페이지
  { path: "/loginworker", component: Login_worker },

  // 기사 회원가입 및 등록페이지
  { path: "/signupworker", component: Signup_worker },
  { path: "/register", component: InfoRegister_worker },

  // 관리자 페이지
  {
    path: "/admin",
    component: AdminHome,
    redirect: "admin/dashboard",
    children: [
      { path: "dashboard", component: Dashboard_admin },
      { path: "reservation", component: Reservation_admin },
      { path: "workermanage", component: Worker_admin },
      { path: "payment", component: Payment_admin },
      { path: "custormer", component: Custormer_admin },
      { path: "notice", component: Notice_admin },
      { path: "settings", component: Settings_admin },
    ],
  },

  // 기사 페이지
  {
    path: "/worker",
    component: WorkerHome,
    redirect: "worker/dashboard",
    children: [
      { path: "dashboard", component: Dashboard_worker },
      { path: "notice", component: Notice_worker },
      { path: "jobs", component: Jobs_worker },
      { path: "mypage", component: Mypage_worker },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 항상 최상단으로 이동
    return { top: 0 };
  },
});
export default router;
