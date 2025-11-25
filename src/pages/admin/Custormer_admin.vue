<template>
  <!-- 통계 카드 -->
  <DashboardStats :stats="reservationStats" />

  <div class="space-y-3">
    <!-- 필터 영역 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs px-7 py-4 text-sm">
      <!-- 첫 번째 줄: 예약일자 필터 -->
      <div class="flex flex-wrap items-center gap-2">
        <select
          v-model="selectedDateType"
          class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="reservation">예약일자</option>
        </select>

        <input
          type="date"
          v-model="dateRange.start"
          class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <span class="text-gray-500 dark:text-gray-400">~</span>

        <input
          type="date"
          v-model="dateRange.end"
          class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="dateFilter"
            v-model="showTomorrowOnly"
            class="w-4 h-4 text-[#E67E50] border-gray-300 rounded ]"
          />
          <label for="dateFilter" class="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
            내일 픽업건만 보기
          </label>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <select
            v-model="sortOrder"
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="latest">최신순</option>
            <option value="oldest">과거순</option>
          </select>

          <select
            v-model="statusFilter"
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">전체상태</option>
            <option value="실온">실온</option>
            <option value="냉장">냉장</option>
            <option value="냉동">냉동</option>
          </select>

          <select
            v-model="dispatchFilter"
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">전체배차</option>
            <option value="예약">예약완료</option>
            <option value="배차">배차완료</option>
            <option value="입고완료">입고완료</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 예약 목록 테이블 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs">
      <!-- 예약 목록 헤더 -->
      <div class="px-7 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">고객문의 관리</h2>

        <div class="relative w-71">
          <input
            v-model="searchQuery"
            @input="handleInput"
            type="text"
            placeholder="고객명 또는 예약번호로 검색하세요"
            class="w-full pl-8 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
          />
          <i class="fas fa-search absolute left-3 top-2 text-gray-400"></i>
        </div>
      </div>

      <!-- 테이블 -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
<th class="px-8 py-2.5 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase">문의유형</th>
<th class="px-8 py-2.5 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase">제목</th>
<th class="px-8 py-2.5 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase">고객명</th>
<th class="px-8 py-2.5 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase">연락처</th>
<th class="px-8 py-2.5 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase">문의일자</th>
<th class="px-8 py-2.5 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase">처리상태</th>
<th class="px-8 py-2.5 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase">답변여부</th>
</tr>
          </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
<tr
v-for="item in paginatedData"
:key="item.id"
class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
@click="handleRowClick(item)"
>
<td class="px-8 py-3 text-sm text-gray-900 dark:text-white">{{ item.type }}</td>
<td class="px-8 py-3 text-sm text-gray-900 dark:text-white">{{ item.title }}</td>
<td class="px-8 py-3 text-sm text-gray-900 dark:text-white">{{ item.customerName }}</td>
<td class="px-8 py-3 text-sm text-gray-900 dark:text-white">{{ item.phone }}</td>
<td class="px-8 py-3 text-sm text-gray-900 dark:text-white">{{ item.date }}</td>
<td class="px-8 py-3 text-sm">
<span :class="getStatusClass(item.status)" class="px-3 py-1 rounded-full text-xs font-medium">
{{ item.status }}
</span>
</td>
<td class="px-8 py-3 text-sm">
<span
:class="item.answered ? 'text-green-600' : 'text-red-500'"
class="font-semibold"
>
{{ item.answered ? '완료' : '미답변' }}
</span>
</td>
</tr>
</tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div class="flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
          >
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
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

   
   
  
  </div>
</template>

<script setup>
import DashboardStats from "@/components/DashboardStats.vue";
import { ref, computed } from "vue";
const inquiries = [
{ id: 1, category: '픽업 문의', question: '다른 보관소에서 수령할 수 있나요?' },
{ id: 2, category: '보관 문의', question: '빵 보관기간이 얼마나 되나요?' },
{ id: 3, category: '배송 문의', question: '다른 지점으로 변경하고 싶어요' },
{ id: 4, category: '기타 문의', question: '주문 완료 후 예약변경이 가능한가요?' },
{ id: 5, category: '결제 문의', question: '보관료 후불 결제 되나요?' },
{ id: 6, category: '픽업 문의', question: '픽업 시간 연장이 가능한가요?' },
{ id: 7, category: '보관 문의', question: '냉장 보관도 가능한가요?' },
{ id: 8, category: '배송 문의', question: '지정 배송 시간에 맞춰 받을 수 있나요?' },
{ id: 9, category: '기타 문의', question: '주문 내역은 어디에서 확인할 수 있나요?' },
{ id: 10, category: '결제 문의', question: '현금영수증 발급 가능한가요?' },
{ id: 11, category: '픽업 문의', question: '대리 수령도 가능한가요?' },
{ id: 12, category: '보관 문의', question: '보관 연장 비용은 얼마인가요?' },
{ id: 13, category: '배송 문의', question: '배송지 변경 시 추가 비용이 있나요?' },
{ id: 14, category: '기타 문의', question: '예약 후 취소가 가능한가요?' },
{ id: 15, category: '결제 문의', question: '카드 결제 오류가 나요. 어떻게 해야 하나요?' },
{ id: 16, category: '픽업 문의', question: '보관소 운영 시간이 어떻게 되나요?' },
{ id: 17, category: '보관 문의', question: '보관 가능한 최대 일수가 어떻게 되나요?' },
{ id: 18, category: '배송 문의', question: '지연 배송 보상 기준이 있나요?' },
{ id: 19, category: '기타 문의', question: '회원 정보 변경은 어디에서 하나요?' },
{ id: 20, category: '결제 문의', question: '부분 환불도 가능한가요?' },
{ id: 21, category: '픽업 문의', question: 'QR 없이도 수령할 수 있나요?' },
{ id: 22, category: '보관 문의', question: '보관 중 상태 확인이 가능한가요?' },
{ id: 23, category: '배송 문의', question: '배송 출발 알림을 받을 수 있나요?' },
{ id: 24, category: '기타 문의', question: '공지사항은 어디에서 보나요?' },
{ id: 25, category: '결제 문의', question: '영수증 재발급이 가능한가요?' },
{ id: 26, category: '픽업 문의', question: '픽업 예약 시간을 변경할 수 있나요?' },
{ id: 27, category: '보관 문의', question: '보관 물품 사진을 볼 수 있나요?' },
{ id: 28, category: '배송 문의', question: '배송 기사님과 직접 연락할 수 있나요?' },
{ id: 29, category: '기타 문의', question: '포인트 적립 기준이 어떻게 되나요?' },
{ id: 30, category: '결제 문의', question: '정기 결제 해지는 어떻게 하나요?' }
];
// 통계 카드 데이터 (Font Awesome 아이콘 사용)
const reservationStats = [
  {
    title: "오늘 예약 건수",
    value: "25건",
    icon: "fas fa-clock",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
  {
    title: "진행중 (배차 신청 완료)",
    value: "12 건",
    icon: "fas fa-layer-group",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
  {
    title: "입고완료",
    value: "11 건",
    icon: "fas fa-calendar-check",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
  {
    title: "취소 / 환불건",
    value: "1건",
    icon: "fas fa-users",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
];

// 필터 상태
const selectedDateType = ref("reservation");
const dateRange = ref({ start: "", end: "" });
const sortOrder = ref("latest");
const statusFilter = ref("all");
const dispatchFilter = ref("all");
const searchQuery = ref("");
const showTomorrowOnly = ref(false);

// 모달 상태
const showDispatchModal = ref(false);
const showDriverModal = ref(false);
const selectedReservation = ref({});

// 페이지네이션
const currentPage = ref(1);
const itemsPerPage = 9;

// 50명의 더미 데이터 생성
const generateDummyData = () => {
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

  const storagePoints = ["경대병원역점", "동대구역점", "서대구역점", "대구공항점", "반월당역점"];
  const statuses = ["실온", "냉장", "냉동"];
  const dispatchStatuses = ["예약완료", "배차완료", "입고완료"];
  const drivers = ["김지산", "이서윤", "박민우", "한나리", "윤예린", "한나연", "정도윤", "오시우", "권하진", "미배정"];

  const data = [];
  for (let i = 1; i <= 50; i++) {
    // 2025-11-26 ~ 2025-12-12 랜덤 날짜
    const startDate = new Date(2025, 10, 26);
    const endDate = new Date(2025, 11, 12);

    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const dispatchStatus = dispatchStatuses[Math.floor(Math.random() * dispatchStatuses.length)];

    // 배차상태에 따라 자동 기사 배정
    let driver;
    if (dispatchStatus === "예약완료") {
      driver = "미배정";
    } else {
      // 배차완료 또는 입고완료인 경우 → 랜덤 기사 배정
      driver = drivers[Math.floor(Math.random() * (drivers.length - 1))];
    }
    data.push({
      id: `${10230 + i}`,
      customerName: names[i - 1],
      phone: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      storagePoint: storagePoints[Math.floor(Math.random() * storagePoints.length)],
      reservationDate: randomDate.toISOString().split("T")[0],
      pickupTime: `${10 + Math.floor(i / 5)}:${(i * 10) % 60}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      driver,
      dispatchStatus,
    });
  }
  return data;
};

const reservations = ref(generateDummyData());

// 검색 핸들러
const handleSearch = () => {
  currentPage.value = 1;
};
// 한글이슈
function handleInput(event) {
  searchQuery.value = event.target.value;
}
// 내일 날짜 계산
const getTomorrowDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};
// 필터링된 데이터
const filteredData = computed(() => {
  let result = [...reservations.value];

  // 검색 필터
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (item) => item.customerName.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)
    );
  }
  //  “내일 픽업건만 보기” 필터 추가
  if (showTomorrowOnly.value) {
    const tomorrow = getTomorrowDate();
    result = result.filter((item) => item.reservationDate === tomorrow);
  }
  // 날짜 필터
  if (dateRange.value.start && dateRange.value.end) {
    result = result.filter((item) => {
      const itemDate = item.reservationDate;
      return itemDate >= dateRange.value.start && itemDate <= dateRange.value.end;
    });
  }

  // 상태 필터
  if (statusFilter.value !== "all") {
    result = result.filter((item) => item.status === statusFilter.value);
  }

  // 배차 필터
  if (dispatchFilter.value !== "all") {
    result = result.filter((item) => item.dispatchStatus === dispatchFilter.value);
  }

  // 정렬
  if (sortOrder.value === "latest") {
    result.sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate));
  } else {
    result.sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate));
  }

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

// 상태 색상
const getStatusClass = (status) => {
  const colors = {
    실온: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    냉장: "bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-300",
    냉동: "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300",
    미배정: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
    예약완료: "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-300",
    입고완료: "bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-300",
    배차완료: "bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300",
  };
  return colors[status] || "bg-gray-100";
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

// 행 클릭
const handleRowClick = (item) => {
  selectedReservation.value = { ...item };
};

// 배차수정 저장
const saveDispatchChanges = () => {
  const index = reservations.value.findIndex((r) => r.id === selectedReservation.value.id);
  if (index !== -1) {
    reservations.value[index] = { ...selectedReservation.value };
  }
  showDispatchModal.value = false;
  alert("배차 정보가 수정되었습니다.");
};

// 기사배정 저장
const saveDriverAssignment = () => {
  const index = reservations.value.findIndex((r) => r.id === selectedReservation.value.id);
  if (index !== -1) {
    reservations.value[index].driver = selectedReservation.value.driver;
  }
  showDriverModal.value = false;
  alert("기사가 배정되었습니다.");
};
</script>
