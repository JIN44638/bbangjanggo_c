<template>
  <!-- 통계 카드 -->
  <DashboardStats :stats="inquiryStats" />

  <div class="space-y-3">
    <!-- 필터 영역 -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xs px-7 py-4 text-sm">
      <div class="flex flex-wrap items-center gap-3">
        <!-- 문의일자 필터 -->
        <div class="flex items-center gap-2">
          <label class="text-gray-700 dark:text-gray-300 whitespace-nowrap"
            >문의일자</label
          >
          <input
            type="date"
            v-model="dateRange.start"
            class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          <span class="text-gray-500 dark:text-gray-400">~</span>
          <input
            type="date"
            v-model="dateRange.end"
            class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
        </div>

        <!-- 문의유형 필터 -->
        <select
          v-model="typeFilter"
          class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
          <option value="all">전체 유형</option>
          <option value="픽업 문의">픽업 문의</option>
          <option value="보관 문의">보관 문의</option>
          <option value="배송 문의">배송 문의</option>
          <option value="결제 문의">결제 문의</option>
          <option value="기타 문의">기타 문의</option>
        </select>

        <!-- 처리상태 필터 -->
        <select
          v-model="statusFilter"
          class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
          <option value="all">전체 상태</option>
          <option value="대기중">대기중</option>
          <option value="처리중">처리중</option>
          <option value="완료">완료</option>
        </select>

        <!-- 답변여부 필터 -->
        <select
          v-model="answeredFilter"
          class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
          <option value="all">전체</option>
          <option value="answered">답변완료</option>
          <option value="unanswered">미답변</option>
        </select>

        <!-- 정렬 -->
        <div class="ml-auto flex items-center gap-2">
          <select
            v-model="sortOrder"
            class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
            <option value="latest">최신순</option>
            <option value="oldest">과거순</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 고객문의 목록 테이블 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs">
      <!-- 헤더 -->
      <div
        class="px-7 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          고객문의 관리
        </h2>

        <div class="relative w-80">
          <input
            v-model="searchQuery"
            @input="handleInput"
            type="text"
            placeholder="고객명 또는 제목으로 검색하세요"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E67E50] focus:border-transparent" />
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <!-- 테이블 -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                문의유형
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                제목
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                고객명
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                연락처
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                문의일자
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                처리상태
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                답변여부
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="item in paginatedData"
              :key="item.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              @click="handleRowClick(item)">
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getTypeClass(item.type)"
                  class="px-2.5 py-1 rounded-md text-xs font-medium">
                  {{ item.type }}
                </span>
              </td>
              <td
                class="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate"
                :title="item.title">
                {{ item.title }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ item.customerName }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ item.phone }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ item.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusClass(item.status)"
                  class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <span
                    :class="
                      item.answered
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-500 dark:text-red-400'
                    "
                    class="font-semibold text-sm">
                    {{ item.answered ? "완료" : "미답변" }}
                  </span>
                  <button
                    v-if="!item.answered"
                    @click.stop="handleAnswerClick(item)"
                    class="px-3 py-1 bg-[#E67E50] text-white text-xs rounded hover:bg-[#d46a3f] transition-colors">
                    답변하기
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedData.length === 0">
              <td
                colspan="7"
                class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                문의 내역이 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div
        class="flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300">
            <i class="fas fa-chevron-left"></i>
          </button>

          <button
            v-for="page in displayPages"
            :key="page"
            @click="gotoPage(page)"
            :class="[
              currentPage === page
                ? 'bg-[#E67E50] text-white border-[#E67E50]'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
              'px-3 py-1 border rounded',
            ]">
            {{ page }}
          </button>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DashboardStats from "@/components/DashboardStats.vue";
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router"; 

const route = useRoute(); 

// 통계 카드 데이터 (computed로 실제 데이터 기반 계산)
const inquiryStats = computed(() => {
  const total = inquiries.value.length;
  const unanswered = inquiries.value.filter((item) => !item.answered).length;
  const processing = inquiries.value.filter(
    (item) => item.status === "처리중"
  ).length;
  const answered = inquiries.value.filter((item) => item.answered).length;

  return [
    {
      title: "전체 문의 건수",
      value: `${total}건`,
      icon: "fas fa-inbox",
      bgColor: "bg-gray-100 dark:bg-gray-700",
    },
    {
      title: "미답변 문의",
      value: `${unanswered}건`,
      icon: "fas fa-exclamation-circle",
      bgColor: "bg-gray-100 dark:bg-gray-700",
    },
    {
      title: "처리중",
      value: `${processing}건`,
      icon: "fas fa-clock",
      bgColor: "bg-gray-100 dark:bg-gray-700",
    },
    {
      title: "답변완료",
      value: `${answered}건`,
      icon: "fas fa-check-circle",
      bgColor: "bg-gray-100 dark:bg-gray-700",
    },
  ];
});

// 필터 상태
const dateRange = ref({ start: "", end: "" });
const sortOrder = ref("latest");
const statusFilter = ref("all");
const typeFilter = ref("all");
const answeredFilter = ref("all");
const searchQuery = ref("");

// 선택된 문의
const selectedInquiry = ref(null);

// 페이지네이션
const currentPage = ref(1);
const itemsPerPage = 10;

// 고객문의 더미 데이터 생성
const generateInquiryData = () => {
  const names = [
    "이준호",
    "박해린",
    "정혜린",
    "오지은",
    "최일도",
    "한지현",
    "김도현",
    "송혜나",
    "박민석",
    "윤서아",
    "강민준",
    "이서윤",
    "김지우",
    "박서준",
    "최예은",
    "정하준",
    "한소희",
    "임시우",
    "조유진",
    "신지훈",
    "홍다은",
    "장민서",
    "오준영",
    "백서현",
    "권도윤",
    "남주아",
    "문재윤",
    "양하늘",
    "하은비",
    "서동현",
    "류예린",
    "안시후",
    "손채원",
    "곽민재",
    "노지안",
    "탁수빈",
    "마서진",
    "진아린",
    "도현우",
    "석예나",
    "설지호",
    "표수아",
    "감민지",
    "방준혁",
    "김서영",
    "복지훈",
    "지예슬",
    "배현성",
    "고다인",
    "성지율",
  ];

  const types = [
    "픽업 문의",
    "보관 문의",
    "배송 문의",
    "결제 문의",
    "기타 문의",
  ];
  const statuses = ["대기중", "처리중", "완료"];
  const questions = [
    "다른 보관소에서 수령할 수 있나요?",
    "빵 보관기간이 얼마나 되나요?",
    "다른 지점으로 변경하고 싶어요",
    "주문 완료 후 예약변경이 가능한가요?",
    "보관료 후불 결제 되나요?",
    "픽업 시간 연장이 가능한가요?",
    "냉장 보관도 가능한가요?",
    "지정 배송 시간에 맞춰 받을 수 있나요?",
    "주문 내역은 어디에서 확인할 수 있나요?",
    "현금영수증 발급 가능한가요?",
    "대리 수령도 가능한가요?",
    "보관 연장 비용은 얼마인가요?",
    "배송지 변경 시 추가 비용이 있나요?",
    "예약 후 취소가 가능한가요?",
    "카드 결제 오류가 나요. 어떻게 해야 하나요?",
    "보관소 운영 시간이 어떻게 되나요?",
    "보관 가능한 최대 일수가 어떻게 되나요?",
    "지연 배송 보상 기준이 있나요?",
    "회원 정보 변경은 어디에서 하나요?",
    "부분 환불도 가능한가요?",
  ];

  const data = [];
  const startDate = new Date(2024, 11, 1);
  const endDate = new Date();

  // 미답변 문의 5개 (고정된 데이터)
  const unansweredInquiriesData = [
    {
      type: "픽업 문의",
      title: "다른 보관소에서 수령할 수 있나요?",
      customerName: "이준호",
      phone: "010-1234-5678",
      date: "2025-12-11",
    },
    {
      type: "보관 문의",
      title: "빵 보관기간이 얼마나 되나요?",
      customerName: "박해린",
      phone: "010-2345-6789",
      date: "2025-12-10",
    },
    {
      type: "배송 문의",
      title: "다른 지점으로 변경하고 싶어요",
      customerName: "정혜린",
      phone: "010-3456-7890",
      date: "2024-12-11",
    },
    {
      type: "기타 문의",
      title: "주문 완료 후 예약변경이 가능한가요?",
      customerName: "오지은",
      phone: "010-4567-8901",
      date: "2025-12-12",
    },
    {
      type: "결제 문의",
      title: "보관료 후불 결제 되나요?",
      customerName: "최일도",
      phone: "010-5678-9012",
      date: "2025-12-11",
    },
  ];

  // 미답변 문의 5개 생성 (고정된 데이터)
  for (let i = 0; i < 5; i++) {
    data.push({
      id: i + 1,
      type: unansweredInquiriesData[i].type,
      title: unansweredInquiriesData[i].title,
      customerName: unansweredInquiriesData[i].customerName,
      phone: unansweredInquiriesData[i].phone,
      date: unansweredInquiriesData[i].date,
      status: "대기중",
      answered: false,
    });
  }

  // 나머지 문의 생성 (답변완료)
  for (let i = 5; i < 50; i++) {
    const randomDate = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime())
    );
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    data.push({
      id: i + 1,
      type: type,
      title: questions[Math.floor(Math.random() * questions.length)],
      customerName: names[i],
      phone: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      date: randomDate.toISOString().split("T")[0],
      status: status,
      answered: true,
    });
  }
  return data;
};

const inquiries = ref(generateInquiryData());

// 미답변 문의 목록
const unansweredInquiries = computed(() => {
  return inquiries.value.filter((item) => !item.answered).slice(0, 5);
});

// 검색 핸들러
function handleInput(event) {
  searchQuery.value = event.target.value;
  currentPage.value = 1;
}

// 필터링된 데이터
const filteredData = computed(() => {
  let result = [...inquiries.value];

  // 검색 필터 (고객명 또는 제목)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.customerName.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query)
    );
  }

  // 날짜 필터
  if (dateRange.value.start && dateRange.value.end) {
    result = result.filter((item) => {
      return (
        item.date >= dateRange.value.start && item.date <= dateRange.value.end
      );
    });
  }

  // 문의유형 필터
  if (typeFilter.value !== "all") {
    result = result.filter((item) => item.type === typeFilter.value);
  }

  // 처리상태 필터
  if (statusFilter.value !== "all") {
    result = result.filter((item) => item.status === statusFilter.value);
  }

  // 답변여부 필터
  if (answeredFilter.value !== "all") {
    if (answeredFilter.value === "answered") {
      result = result.filter((item) => item.answered === true);
    } else {
      result = result.filter((item) => item.answered === false);
    }
  }

  // 정렬 (미답변 문의를 항상 맨 위로)
  result.sort((a, b) => {
    // 미답변 문의를 먼저 표시
    if (a.answered !== b.answered) {
      return a.answered ? 1 : -1;
    }
    // 같은 답변 상태 내에서는 날짜순 정렬
    if (sortOrder.value === "latest") {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  return result;
});

// 페이지네이션된 데이터
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredData.value.slice(start, end);
});

// 총 페이지 수
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage);
});

// 표시할 페이지 번호들
const displayPages = computed(() => {
  const pages = [];
  const maxDisplay = 5;
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + maxDisplay - 1);

  if (end - start < maxDisplay - 1) {
    start = Math.max(1, end - maxDisplay + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// 문의유형 색상
const getTypeClass = (type) => {
  const colors = {
    "픽업 문의":
      "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
    "보관 문의":
      "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300",
    "배송 문의":
      "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300",
    "결제 문의":
      "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-300",
    "기타 문의":
      "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300",
  };
  return (
    colors[type] ||
    "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
  );
};

// 처리상태 색상
const getStatusClass = (status) => {
  const colors = {
    대기중:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    처리중: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
    완료: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
  };
  return (
    colors[status] ||
    "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
  );
};

// 페이지 이동
const gotoPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// 행 클릭 (문의 상세 보기)
const handleRowClick = (item) => {
  selectedInquiry.value = { ...item };
  console.log("선택된 문의:", item);
};

// 답변하기 클릭 처리
const handleAnswerClick = (item) => {
  const index = inquiries.value.findIndex((inquiry) => inquiry.id === item.id);
  if (index !== -1) {
    inquiries.value[index].answered = true;
    inquiries.value[index].status = "완료";
    alert("답변이 완료되었습니다.");
  }
};

// 전체보기 클릭 처리 (미답변 필터 적용)
const showAllInquiries = () => {
  answeredFilter.value = "unanswered";
  currentPage.value = 1;
  setTimeout(() => {
    const tableElement = document.querySelector(
      ".bg-white.dark\\:bg-gray-800.rounded-lg.shadow-xs"
    );
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 100);
};

// 🔥 여기가 추가된 부분입니다! 🔥
// 대시보드에서 넘어온 쿼리 파라미터를 확인하여 필터 적용
onMounted(() => {
  if (route.query.filter === "unanswered") {
    answeredFilter.value = "unanswered";
    
    // 테이블로 스크롤 이동
    setTimeout(() => {
      const tableElement = document.querySelector(
        ".bg-white.dark\\:bg-gray-800.rounded-lg.shadow-xs"
      );
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }
});
</script>