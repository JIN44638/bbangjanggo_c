<template>
  <div class="space-y-6 p-6 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
    <!-- 페이지 헤더 -->
   

    <!-- 통계 카드 -->
   

    <!-- 검색 및 필터 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="handleInput"
              type="text"
              placeholder="고객명 또는 이메일로 검색"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <i
              class="fas fa-search absolute left-3 top-3 text-gray-400 dark:text-gray-500"></i>
          </div>
        </div>
        <div class="flex gap-2">
          <select
            v-model="statusFilter"
            class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="all">전체 상태</option>
            <option value="active">작성일</option>
            <option value="inactive">제목</option>
            <option value="blocked">작성자</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 고객 목록 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          공지사항
        </h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              번호
              </th>
              
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
               제목
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                작성자
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                작성일
              </th>
              
            </tr>
            
          </thead>
        
          <tbody
            v-for="customer in paginatedCustomers"
            :key="customer.id"
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
       
          class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
        >
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{{ customer.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">{{ customer.title }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">{{ customer.author }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">{{ customer.date }}</td>
        </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div
      class="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        총 <span class="font-medium">{{ filteredCustomers.length }}</span
        >명의 고객
      </div>
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            currentPage === page
              ? ' bg-[#50311D] text-white bg- text-[#50311D]'
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
          ]"
          class="px-3 py-1 border rounded transition-colors">
          {{ page }}
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
    <!-- 삭제 확인 모달 -->
    <div
      v-if="showDeleteModal"
      class="modal fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              고객 삭제
            </h3>
            <button
              @click="closeDeletModal"
              class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="p-6">
          <!-- customerToDelete?.name 구문에서 ?.는 Optional Chaining(옵셔널 체이닝) 문법입니다. 
             이 문법은 customerToDelete가 null 또는 undefined여도 오류 없이 안전하게 접근 -->
          <!-- customerToDelete가 존재하면 → customerToDelete.name 값을 출력
  
  customerToDelete가 null 또는 undefined이면 → 아무것도 출력하지 않음 (에러 발생하지 않음) -->
          <p class="text-sm text-gray-900 dark:text-white">
            정말로 {{ customerToDelete?.name }} 고객을 삭제하시겠습니까?
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            삭제된 고객 정보는 복구할 수 없습니다.
          </p>
        </div>
        <div
          class="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
          <button
            @click="closeDeletModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
            취소
          </button>
          <button
            @click="deleteCustomer"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">
            삭제
          </button>
        </div>
      </div>
    </div>

  
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
const showCustomerForm = ref(false);
const showDeleteModal = ref(false);
const showCustomerDetailsModal = ref(false);
const searchQuery = ref("");
const statusFilter = ref("all");
// 한글이슈
function handleInput(event) {
  searchQuery.value = event.target.value;
}
// 고객목록
const customers = ref([
   { id: 1, title: "대구역 보관소 냉장설비 정기 점검 안내드립니다.", author: "박정은", date: "2025-11-18" },
        { id: 2, title: "배차 현황 실시간 새로고침 기능이 추가되었습니다.", author: "김민승", date: "2025-11-17" },
        { id: 3, title: "10월 25일(금) 02:00~04:00 서버 점검 예정", author: "박진성", date: "2025-11-16" },
        { id: 4, title: "‘입고 알림 자동 전송’ 기능이 새로 추가되었습니다!", author: "김명진", date: "2025-11-15" },
        { id: 5, title: "10월 1일부터 보관 수수료 정책이 일부 변경됩니다.", author: "김민승", date: "2025-11-14" },
   { id: 6, title: "대구역 보관소 냉장설비 정기 점검 안내드립니다.", author: "박정은", date: "2025-11-18" },
        { id: 7, title: "배차 현황 실시간 새로고침 기능이 추가되었습니다.", author: "김민승", date: "2025-11-17" },
        { id: 8, title: "10월 25일(금) 02:00~04:00 서버 점검 예정", author: "박진성", date: "2025-11-16" },
        { id: 9, title: "‘입고 알림 자동 전송’ 기능이 새로 추가되었습니다!", author: "김명진", date: "2025-11-15" },
        { id: 10, title: "10월 1일부터 보관 수수료 정책이 일부 변경됩니다.", author: "김민승", date: "2025-11-14" },
   { id: 11, title: "대구역 보관소 냉장설비 정기 점검 안내드립니다.", author: "박정은", date: "2025-11-18" },
        { id: 12, title: "배차 현황 실시간 새로고침 기능이 추가되었습니다.", author: "김민승", date: "2025-11-17" },
        { id: 13, title: "10월 25일(금) 02:00~04:00 서버 점검 예정", author: "박진성", date: "2025-11-16" },
        { id: 14, title: "‘입고 알림 자동 전송’ 기능이 새로 추가되었습니다!", author: "김명진", date: "2025-11-15" },
        { id: 15, title: "10월 1일부터 보관 수수료 정책이 일부 변경됩니다.", author: "김민승", date: "2025-11-14" },
         { id: 16, title: "신규 기사 교육 일정 안내", author: "박진성", date: "2025-11-18" },
        { id: 17, title: "대구역 냉장보관소 정기 점검 소식", author: "박정은", date: "2025-11-17" },
        { id: 18, title: "대구역 냉장보관소 정기 점검 안내", author: "김민승", date: "2025-11-16" },
        { id: 19, title: "냉장설비 점검 안내 대구역 보관소", author: "김명진", date: "2025-11-15" },
        { id: 20, title: "대구역 보관소 냉장설비 정기 점검 안내", author: "박진성", date: "2025-11-14" },
]);
// 필터링 관련
const filteredCustomers = computed(() => {
  // 고객데이터 복사
  let result = [...customers.value];
  // 검색어 필터링
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) || //이름에 포함되어 있으면 통화
        customer.eamil.toLowerCase().includes(query)
    );
  }
  // 상태필더링
  if (statusFilter.value !== "all") {
    result = result.filter(
      (customer) => customer.status === statusFilter.value //상태가 선택한 값과 일치하는지 확인
    );
  }

  //최종 필터링된 고객 목록 반환
  return result;
});
// 페이네이션
const currentPage = ref(1);
const itemsPerPage = ref(10);
// 전체 페이지수 계산
const totalPages = computed(() => {
  return Math.ceil(filteredCustomers.value.length / itemsPerPage.value);
});
// 현재 페이지에 보여줄 고객목록 계산
const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCustomers.value.slice(start, end);
});
// 페이지로 이동하는 함수
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
// 다음페이지로 이동
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
// 이전페이지로 이동
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
// 숫자를 원화 동화 형식으로 포맷
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency", // 통화 형식
    currency: "KRW", // 원화(KRW)
    maximumFractionDigits: 0, // 소수점 없음
  }).format(amount);
};
// 상태글자 변환
const getStatusText = (status) => {
  const statusMap = {
    active: "활성",
    inactive: "비활성",
    blocked: "차단",
  };
  return statusMap[status] || status;
};
const getStatusClass = (status) => {
  const statusClasses = {
    active: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    inactive:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    blocked: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
  };
  return (
    statusClasses[status] ||
    "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300"
  );
};
const getStatusDotClass = (status) => {
  const statusClasses = {
    active: "bg-green-400 dark:bg-green-500",
    inactive: "bg-yellow-400 dark:bg-yellow-500",
    blocked: "bg-red-400 dark:bg-red-500",
  };
  return statusClasses[status] || "bg-gray-400 dark:bg-gray-500";
};
// 고객 상세 보기 모달 열기
const selectedCustomer = ref(null);
const showCustomerDetails = (customer) => {
  selectedCustomer.value = customer; //선택된 고객 정보 저장
  showCustomerDetailsModal.value = true;
};
// 고객 상세 보기 모달 닫기
const closeCustomerDetailsModal = () => {
  showCustomerDetailsModal.value = false;
  selectedCustomer.value = null;
};
// 특정 인덱스의 선호 메뉴 항목 삭제
const removeFavoriteItem = (index) => {
  selectedCustomer.value.favoriteItems.splice(index, 1); //배열에서 제거
};
// 선호 메뉴 항목 추가
const addFavoriteItem = () => {
  if (!selectedCustomer.value.favoriteItems) {
    selectedCustomer.value.favoriteItems = []; //배열이 없으면 초기화
  }
  selectedCustomer.value.favoriteItems.push("");
};
// 고객 상세 정보 저장
const saveCustomerDetails = () => {
  // 1.고객 목록에서 현재 선택된 고객의 인덱스를 찾는다
  const index = customers.value.findIndex(
    (c) => c.id === selectedCustomer.value.id
  );
  if (index !== -1) {
    // 2.빈 문자열로 된 선호 메뉴 항목은 제거
    selectedCustomer.value.favoriteItems =
      selectedCustomer.value.favoriteItems.filter((item) => item.trim() !== "");
    //   3.수정된 고객 정보를 고객 목록에 반영
    customers.value[index] = { ...selectedCustomer.value };
    // 모달 닫기
    closeCustomerDetailsModal();
  }
};
// 고객 삭제 모달 열기
// 삭제할 고객 객체를 저장하는 변수
const customerToDelete = ref(null);
const confirmDelete = (customer) => {
  customerToDelete.value = customer; //삭제할 고객 정보 저장
  showDeleteModal.value = true; //삭제확인 모달 표시
};
// 삭제모달 닫기
const closeDeletModal = () => {
  customerToDelete.value = null;
  showDeleteModal.value = false;
};
// 실제 고객 삭제 처리
const deleteCustomer = () => {
  if (customerToDelete.value) {
    // 고객 삭제
    customers.value = customers.value.filter(
      (c) => c.id !== customerToDelete.value.id
    );
    // 삭제후 모달 닫기
    closeDeletModal();
  }
};
// 전체고객 수를 계산하는 계산 속성
const totalCustomers = computed(() => customers.value.length);
// 활성상태인 고객만 필더링하여 그수를 계산하느 계산 속성
const activeCustomers = computed(
  () =>
    customers.value.filter((customer) => customer.status === "active").length
);
</script>
