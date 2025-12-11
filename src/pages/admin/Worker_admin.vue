<template>
  <!-- 통계 카드 -->
  <DashboardStats :stats="stats" />

  <div class="space-y-3">
    <!-- 필터 영역 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs px-7 py-4 text-sm">
      <div class="flex flex-wrap items-center gap-2">
        <select
          v-model="selectedDateType"
          class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="joinDate">입사일자</option>
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
            <option value="all">운송수단</option>
            <option value="오토바이">오토바이</option>
            <option value="도보">도보</option>
            <option value="자전거">자전거</option>
          </select>

          <select
            v-model="regionFilter"
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">전체 배정지역</option>
            <option value="중구">중구</option>
            <option value="동구">동구</option>
            <option value="서구">서구</option>
            <option value="남구">남구</option>
            <option value="북구">북구</option>
            <option value="달서구">달서구</option>
            <option value="달성군">달성군</option>
          </select>

          <select
            v-model="workStatusFilter"
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">전체 근무상태</option>
            <option value="배차중">배차중</option>
            <option value="대기중">대기중</option>
            <option value="휴무">휴무</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 기사 목록 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs">
      <div class="px-7 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">기사 목록</h2>

        <div class="relative w-71">
          <input
            v-model="searchQuery"
            type="text"
            @input="updateName"
            placeholder="기사명으로 입력하세요"
            class="w-full pl-8 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
          />
          <i class="fas fa-search absolute left-3 top-2 text-gray-400"></i>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table
          class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          style="border-collapse: collapse; table-layout: fixed"
        >
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-8 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 100px"
              >
                기사명
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 120px"
              >
                기사ID
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 130px"
              >
                연락처
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 200px"
              >
                주소
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 130px"
              >
                입사 일자
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 100px"
              >
                운송수단
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 100px"
              >
                배정지역
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 100px"
              >
                근무상태
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 60px"
              >
                관리
              </th>
            </tr>
          </thead>

          <tbody
            v-if="paginatedData.length"
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
          >
            <tr
              v-for="worker in paginatedData"
              :key="worker.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              @click="handleRowClick(worker, $event)"
            >
              <td class="px-8 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 100px">
                {{ worker.name }}
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 120px">
                {{ worker.workerId }}
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 130px">
                {{ worker.phone }}
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 200px">
                {{ worker.address }}
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 130px">
                {{ worker.joinDate }}
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 100px">
                <Badge :type="worker.vehicle" :label="worker.vehicle" />
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 100px">
                 <Badge :type="worker.region" :label="worker.region" />
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 100px">
                <Badge :type="worker.workStatus" :label="worker.workStatus" />
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 60px; padding-right: 10px">
                <button
                  @click.stop="openEditWorkerModal(worker)"
                  class="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-xs"
                >
                  수정
                </button>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr>
              <td colspan="9" class="text-center text-gray-400 py-4">조건에 맞는 기사가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @prev="prevPage"
        @next="nextPage"
        @goto="gotoPage"
      />
    </div>

    <!-- 하단 버튼 영역 -->
    <div class="flex justify-end gap-3">
      <button
        @click="openAddWorkerModal"
        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
      >
        신규기사추가
      </button>
    </div>

    <!-- 신규 기사 추가 모달 -->
    <div v-if="showAddWorkerModal" class="fixed inset-0 bg-gray-500/75 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs max-w-xl w-full">
        <!-- 헤더 -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">신규 기사 추가</h3>
          <button @click="closeAddWorkerModal" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- 내용 -->
        <div class="p-8">
          <div class="space-y-4">
            <div class="flex space-x-4">
              <!-- 왼쪽 -->
              <div class="flex-1 space-y-4">
                <!-- 기사명, ID, 연락처 등 기존 필드 그대로 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">기사명</label>
                  <input
                    v-model="newWorker.name"
                    type="text"
                    placeholder="기사명을 입력하세요"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">기사 ID</label>
                  <input
                    v-model="newWorker.workerId"
                    type="text"
                    placeholder="기사 ID를 입력하세요"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">연락처</label>
                  <input
                    v-model="newWorker.phone"
                    type="tel"
                    @input="formatPhoneEdit"
                    placeholder="010-0000-0000"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <!-- 주소 검색 필드 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">주소</label>
                  <input
                    v-model="newWorker.address"
                    type="text"
                    placeholder="주소를 입력하세요"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <button
                    type="button"
                    @click="openDaumPostcode"
                    class="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm mt-2"
                  >
                    우편번호 찾기
                  </button>

                  <!-- 상세주소 -->
                  <input
                    v-model="newWorker.detailAddress"
                    type="text"
                    placeholder="상세주소"
                    class="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />

                  <!-- 참고항목 -->
                  <input
                    v-model="newWorker.extraAddress"
                    type="text"
                    placeholder="참고항목"
                    class="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    readonly
                  />
                </div>
              </div>

              <!-- 오른쪽 -->
              <div class="flex-1 space-y-4">
                <!-- 기존 오른쪽 필드 그대로 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">입사일자</label>
                  <input
                    v-model="newWorker.joinDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">운송수단</label>
                  <select
                    v-model="newWorker.vehicle"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">선택하세요</option>
                    <option value="오토바이">오토바이</option>
                    <option value="도보">도보</option>
                    <option value="자전거">자전거</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">배정지역</label>
                  <select
                    v-model="newWorker.region"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">선택하세요</option>
                    <option value="중구">중구</option>
                    <option value="동구">동구</option>
                    <option value="서구">서구</option>
                    <option value="남구">남구</option>
                    <option value="북구">북구</option>
                    <option value="달서구">달서구</option>
                    <option value="달성군">달성군</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">근무상태</label>
                  <select
                    v-model="newWorker.workStatus"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">선택하세요</option>
                    <option value="배차중">배차중</option>
                    <option value="대기중">대기중</option>
                    <option value="휴무">휴무</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 모달 하단 버튼 -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end gap-3">
          <button
            @click="closeAddWorkerModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            취소
          </button>
          <button
            @click="saveNewWorker"
            class="px-4 py-2 bg-[#E67E50] hover:bg-[#d16f45] text-white rounded-md text-sm font-medium"
          >
            추가
          </button>
        </div>
      </div>
    </div>

    <!-- 기사 수정 모달 -->
    <div v-if="showEditWorkerModal" class="fixed inset-0 bg-gray-500/75 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs max-w-xl w-full">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">기사 정보 수정</h3>
          <button @click="closeEditWorkerModal" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-8">
          <div class="space-y-4">
            <div class="flex space-x-4">
              <!-- 왼쪽 -->
              <div class="flex-1 space-y-4">
                <!-- 기사명 (비활성화) -->
                <div>
                  <label class="block text-sm font-medium mb-2">기사명</label>
                  <input
                    v-model="editWorker.name"
                    type="text"
                    disabled
                    class="w-full px-3 py-2 border border-gray-300 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500"
                  />
                </div>

                <!-- 기사 ID (비활성화) -->
                <div>
                  <label class="block text-sm font-medium mb-2">기사 ID</label>
                  <input
                    v-model="editWorker.workerId"
                    type="text"
                    disabled
                    class="w-full px-3 py-2 border border-gray-300 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500"
                  />
                </div>

                <!-- 연락처 -->
                <div>
                  <label class="block text-sm font-medium mb-2">연락처</label>
                  <input
                    v-model="editWorker.phone"
                    type="tel"
                    @input="formatPhoneEdit"
                    class="w-full px-3 py-2 border border-gray-300 text-sm rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>

                <!-- 주소 -->
                <!-- 주소 입력 -->
                <div>
                  <label class="block text-sm font-medium mb-2">주소</label>
                  <input
                    v-model="editWorker.address"
                    type="text"
                    placeholder="주소를 입력하세요"
                    class="w-full px-3 py-2 border border-gray-300 text-sm rounded-lg bg-white dark:bg-gray-700"
                  />
                  <button
                    type="button"
                    @click="execDaumPostcode"
                    class="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm ml-2"
                  >
                    우편번호 찾기
                  </button>

                  <!-- 상세주소 입력 -->
                  <input
                    v-model="editWorker.detailAddress"
                    type="text"
                    placeholder="상세주소"
                    class="w-full mt-2 px-3 py-2 border border-gray-300 text-sm rounded-lg bg-white dark:bg-gray-700"
                  />

                  <!-- 참고항목 -->
                  <input
                    v-model="editWorker.extraAddress"
                    type="text"
                    placeholder="참고항목"
                    class="w-full mt-2 px-3 py-2 border border-gray-300 text-sm rounded-lg bg-white dark:bg-gray-700"
                    readonly
                  />
                </div>
              </div>

              <!-- 오른쪽 -->
              <div class="flex-1 space-y-4">
                <!-- 입사일 -->
                <div>
                  <label class="block text-sm font-medium mb-2">입사일</label>
                  <input
                    v-model="editWorker.joinDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 text-sm rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>

                <!-- 운송수단 -->
                <div>
                  <label class="block text-sm font-medium mb-2">운송수단</label>
                  <select
                    v-model="editWorker.vehicle"
                    class="w-full px-3 py-2 border border-gray-300 text-sm rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="오토바이">오토바이</option>
                    <option value="도보">도보</option>
                    <option value="자전거">자전거</option>
                  </select>
                </div>

                <!-- 배정지역 -->
                <div>
                  <label class="block text-sm font-medium mb-2">배정지역</label>
                  <select
                    v-model="editWorker.region"
                    class="w-full px-3 py-2 border border-gray-300 text-sm rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="중구">중구</option>
                    <option value="동구">동구</option>
                    <option value="서구">서구</option>
                    <option value="남구">남구</option>
                    <option value="북구">북구</option>
                    <option value="달서구">달서구</option>
                    <option value="달성군">달성군</option>
                  </select>
                </div>

                <!-- 근무상태 -->
                <div>
                  <label class="block text-sm font-medium mb-2">근무상태</label>
                  <select
                    v-model="editWorker.workStatus"
                    class="w-full px-3 py-2 border border-gray-300 text-sm rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="배차중">배차중</option>
                    <option value="대기중">대기중</option>
                    <option value="휴무">휴무</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end gap-3">
          <button @click="closeEditWorkerModal" class="px-4 py-2 border border-gray-300 rounded-md text-sm">
            닫기
          </button>

          <button @click="saveWorkerChanges" class="px-4 py-2 bg-[#E67E50] text-white rounded-md text-sm">저장</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 우편번호 검색 오버레이 (신규/수정 공용) -->
  <div v-if="showPostcode" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
    <div class="relative bg-white rounded-lg shadow-xl overflow-hidden" style="width: 430px; height: 520px">
      <button class="absolute right-3 top-3 text-gray-500 hover:text-gray-700" @click="closeDaumPostcode">
        <i class="fas fa-times"></i>
      </button>
      <img
        src="//t1.daumcdn.net/postcode/resource/images/close.png"
        id="btnFoldWrap"
        class="cursor-pointer absolute right-[0px] top-[0px] z-10"
        @click="closeDaumPostcode"
        alt="접기 버튼"
      />
      <div ref="postcodeLayer" class="w-full h-full"></div>
    </div>
  </div>
</template>

<script setup>
import DashboardStats from "@/components/DashboardStats.vue";
import Pagination from "@/components/Pagination.vue";
import Badge from "@/components/Badge.vue";
import { ref, computed, nextTick } from "vue";

// 통계 카드 데이터
const workerStats = ref([
  { title: "전체 기사", value: "0명", icon: "fas fa-users", bgColor: "bg-gray-100 dark:bg-gray-700" },
  { title: "오늘 배차된 기사", value: "0명", icon: "fas fa-truck", bgColor: "bg-gray-100 dark:bg-gray-700" },
  { title: "대기중인 기사", value: "0명", icon: "fas fa-clock", bgColor: "bg-gray-100 dark:bg-gray-700" },
  { title: "휴무중인 기사", value: "0명", icon: "fas fa-coffee", bgColor: "bg-gray-100 dark:bg-gray-700" },
]);

// 필터 상태
const selectedDateType = ref("joinDate");
const dateRange = ref({ start: "", end: "" });
const sortOrder = ref("latest");
const statusFilter = ref("all");
const regionFilter = ref("all");
const workStatusFilter = ref("all");
const searchQuery = ref("");

// 모달 상태
const showAddWorkerModal = ref(false);
const showEditWorkerModal = ref(false);

// 신규 기사 데이터
const newWorker = ref({
  name: "",
  workerId: "",
  phone: "",
  address: "",
  detailAddress: "",
  extraAddress: "",
  joinDate: "",
  vehicle: "",
  region: "",
  workStatus: "",
});

// 선택된 기사 데이터
const editWorker = ref({
  name: "",
  workerId: "",
  phone: "",
  address: "",
  detailAddress: "",
  extraAddress: "",
  joinDate: "",
  vehicle: "",
  region: "",
  workStatus: "",
});

// 페이지네이션
const currentPage = ref(1);
const itemsPerPage = 9;

// 주소 자동완성 관련 상태
const addresses = ref([]);
const showAddressList = ref(false);

// 카카오 REST API 키 (실제 키로 교체 필요)
const KAKAO_API_KEY = "6ff0fb0bbc63dd35440449b3aaf12b46";

// 주소 검색 함수
// let searchTimeout = null;
// const searchAddress = async () => {
//   // 디바운싱: 300ms 후에 검색 실행
//   if (searchTimeout) clearTimeout(searchTimeout);

//   if (!newWorker.value.address || newWorker.value.address.length < 2) {
//     addresses.value = [];
//     return;
//   }

//   searchTimeout = setTimeout(async () => {
//     try {
//       const response = await fetch(
//         `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(newWorker.value.address)}`,
//         {
//           headers: {
//             Authorization: `KakaoAK ${KAKAO_API_KEY}`,
//           },
//         }
//       );
//       const data = await response.json();
//       addresses.value = data.documents || [];
//     } catch (error) {
//       console.error("주소 검색 오류:", error);
//       addresses.value = [];
//     }
//   }, 300);
// };

// // 주소 선택 함수
// const selectAddress = (addr) => {
//   newWorker.value.address = addr.road_address_name || addr.address_name;
//   addresses.value = [];
//   showAddressList.value = false;
// };

// 더미 데이터 생성
const generateDummyWorkers = () => {
  const names = [
    "김지산",
    "문연준",
    "장수아",
    "조현우",
    "유예린",
    "한나연",
    "정도윤",
    "오시우",
    "박민준",
    "이서연",
    "최지훈",
    "정하은",
    "강민서",
    "윤도현",
    "임채원",
    "송지안",
    "신예준",
    "오하린",
    "황서진",
    "권민재",
    "백지우",
    "노아현",
    "탁수빈",
    "마도윤",
    "진서아",
    "도준혁",
    "석예나",
    "설지호",
    "표수민",
    "감하늘",
  ];

  const workerIds = [
    "jiaan_kim07",
    "seoyoon_lee_92",
    "mjpark_official",
    "harin_c97",
    "yerin_u_",
    "nayeon_hanx",
    "doyoon_jung03",
    "siwoo_oh_0811",
    "minjun_park21",
    "seoyeon_lee88",
    "jihoon_choi95",
    "haeun_jung12",
    "minseo_kang77",
    "dohyun_yun33",
    "chaewon_lim66",
    "jian_song44",
    "yejun_shin99",
    "harin_oh22",
    "seojin_hwang55",
    "minjae_kwon11",
    "jiwoo_baek88",
    "ahyun_noh77",
    "subin_tak33",
    "doyoon_ma99",
    "seoa_jin22",
    "junhyuk_do44",
    "yena_seok66",
    "jiho_seol11",
    "sumin_pyo88",
    "haneul_gam55",
  ];

  const addresses = [
    "대구 단원로 58, 스위트브릭 A동 304호",
    "대구 밀알리 23, 소글빵하우스 1층",
    "대구 쿠지대로 132, 브레드스케어 202호",
    "대구 오보칼 9-1, 콘드라스타워 5층",
    "대구 바터로 28, 크림시티 401호",
    "대구 해물로 45, 달콤상가 101호",
    "대구 햇구름구 12-3, 빵장고타운 2층",
    "대구 크로플걸 77, 캄빵빌딩 3층",
    "대구 마카롱길 88, 슈가팰리스 5층",
    "대구 쿠키로 156, 베이커리하우스 1동",
    "대구 브레드거리 44, 밀가루타워 3층",
    "전주 페이스트리길 99, 스위트빌딩 2층",
    "대구 머핀대로 123, 오븐플라자 4층",
    "청주 크림로 67, 슈거빌 1층",
    "대구 도넛길 22, 달콤맨션 6층",
    "포항 크루아상로 111, 버터빌딩 3층",
    "대구 에클레어길 55, 크림타워 2층",
    "진주 마들렌로 88, 바닐라하우스 5층",
    "대구 슈크림길 33, 카스테라빌딩 1층",
    "대구 타르트로 99, 프로스팅타워 4층",
    "대구 파이길 44, 글레이즈맨션 2층",
    "대구 쿠키대로 77, 아이싱빌 3층",
    "대구 케이크로 122, 휘핑타워 5층",
    "경주 롤케이크길 66, 스펀지하우스 1층",
    "대구 컵케이크로 155, 버터크림빌 6층",
    "구미 푸딩길 88, 크렘빌딩 2층",
    "대구 와플로 44, 메이플타워 4층",
    "대구 초코칩길 99, 넛츠하우스 3층",
    "대구 브라우니로 33, 캐러멜빌 1층",
    "대구 시나몬길 77, 슈가코팅타워 5층",
  ];

  const vehicles = ["오토바이", "도보", "자전거"];
  const regions = ["중구", "동구", "서구", "남구", "북구", "달서구", "달성군"];
  const workStatuses = ["배차중", "대기중", "휴무"];

  const workers = [];
  for (let i = 0; i < 30; i++) {
    const startDate = new Date(2025, 0, 1);
    const endDate = new Date(2025, 11, 12);
    const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const randomDate = new Date(randomTimestamp);

    const joinDate = `${randomDate.getFullYear()}-${String(randomDate.getMonth() + 1).padStart(2, "0")}-${String(
      randomDate.getDate()
    ).padStart(2, "0")}`;

    workers.push({
      id: i + 1,
      name: names[i],
      workerId: workerIds[i],
      phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(
        Math.floor(Math.random() * 9000) + 1000
      )}`,
      address: addresses[i],
      joinDate: joinDate,
      vehicle: vehicles[Math.floor(Math.random() * vehicles.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      workStatus: workStatuses[Math.floor(Math.random() * workStatuses.length)],
    });
  }

  return workers;
};

const workers = ref(generateDummyWorkers());

// 통계 카드 계산
const stats = computed(() => {
  const total = workers.value.length;
  const dispatched = workers.value.filter((w) => w.workStatus === "배차중").length;
  const waiting = workers.value.filter((w) => w.workStatus === "대기중").length;
  const dayOff = workers.value.filter((w) => w.workStatus === "휴무").length;

  return [
    { ...workerStats.value[0], value: `${total}명` },
    { ...workerStats.value[1], value: `${dispatched}명` },
    { ...workerStats.value[2], value: `${waiting}명` },
    { ...workerStats.value[3], value: `${dayOff}명` },
  ];
});

// 필터링된 데이터
const filteredData = computed(() => {
  let result = [...workers.value];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((w) => w.name.toLowerCase().includes(q) || w.workerId.toLowerCase().includes(q));
  }

  if (dateRange.value.start && dateRange.value.end) {
    const start = new Date(dateRange.value.start);
    const end = new Date(dateRange.value.end);
    result = result.filter((worker) => {
      const [year, month, day] = worker.joinDate.match(/\d+/g).map(Number);
      const workerDate = new Date(year, month - 1, day);
      return workerDate >= start && workerDate <= end;
    });
  }

  if (statusFilter.value !== "all") {
    result = result.filter((w) => w.vehicle === statusFilter.value);
  }

  if (regionFilter.value !== "all") {
    result = result.filter((w) => w.region === regionFilter.value);
  }

  if (workStatusFilter.value !== "all") {
    result = result.filter((w) => w.workStatus === workStatusFilter.value);
  }

  result.sort((a, b) => {
    const dateA = new Date(a.joinDate.replace(/년 |월 |일/g, "-").replace(/-$/, ""));
    const dateB = new Date(b.joinDate.replace(/년 |월 |일/g, "-").replace(/-$/, ""));
    return sortOrder.value === "latest" ? dateB - dateA : dateA - dateB;
  });

  return result;
});

// 페이지네이션된 데이터
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredData.value.slice(start, start + itemsPerPage);
});

// 총 페이지 수
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage));

// 페이지 이동
const gotoPage = (p) => {
  if (p >= 1) currentPage.value = p;
};
const prevPage = () => currentPage.value > 1 && currentPage.value--;
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++;

// 행 클릭
const handleRowClick = (worker, event) => {
  if (event.target.closest("button") || event.target.closest("i") || event.target.closest("svg")) {
    return;
  }
  console.log("선택된 기사:", worker);
};

// 신규 기사 추가 모달 열기
const openAddWorkerModal = () => {
  showAddWorkerModal.value = true;
};

// 신규 기사 추가 모달 닫기
const closeAddWorkerModal = () => {
  showAddWorkerModal.value = false;
  addresses.value = [];
  showAddressList.value = false;
  newWorker.value = {
    name: "",
    workerId: "",
    phone: "",
    address: "",
    detailAddress: "",
    extraAddress: "",
    joinDate: "",
    vehicle: "",
    region: "",
    workStatus: "",
  };
};

// 우편번호 레이어 상태
const postcodeLayer = ref(null);
const showPostcode = ref(false);

const closeDaumPostcode = () => {
  showPostcode.value = false;
};

const DAUM_POSTCODE_SRC = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
let daumScriptPromise = null;
const ensureDaumPostcodeLoaded = () => {
  if (typeof window === "undefined") return Promise.reject(new Error("window not available"));
  if (window.daum?.Postcode) return Promise.resolve();
  if (!daumScriptPromise) {
    daumScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = DAUM_POSTCODE_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Daum postcode script"));
      document.head.appendChild(script);
    });
  }
  return daumScriptPromise;
};

// 신규 기사용 주소 검색
const openDaumPostcode = async () => {
  showPostcode.value = true;
  await ensureDaumPostcodeLoaded();
  await nextTick();
  if (!postcodeLayer.value) return;

  new window.daum.Postcode({
    oncomplete: function (data) {
      const addr = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
      let extraAddr = "";

      if (data.userSelectedType === "R") {
        if (data.bname && /[동|로|가]$/g.test(data.bname)) extraAddr += data.bname;
        if (data.buildingName && data.apartment === "Y") extraAddr += (extraAddr ? ", " : "") + data.buildingName;
        if (extraAddr) extraAddr = `(${extraAddr})`;
      }

      newWorker.value.address = addr;
      newWorker.value.extraAddress = extraAddr;

      // 상세주소 필드로 포커스
      setTimeout(() => {
        const el = document.querySelector('input[placeholder="상세주소"]');
        if (el) el.focus();
      }, 100);

      closeDaumPostcode();
    },
    width: "100%",
    height: "100%",
  }).embed(postcodeLayer.value);
};

// 수정 모달용 주소 검색
const execDaumPostcode = async () => {
  showPostcode.value = true;
  await ensureDaumPostcodeLoaded();
  await nextTick();
  if (!postcodeLayer.value) return;

  new window.daum.Postcode({
    oncomplete: function (data) {
      const addr = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
      let extraAddr = "";

      if (data.userSelectedType === "R") {
        if (data.bname && /[동|로|가]$/g.test(data.bname)) extraAddr += data.bname;
        if (data.buildingName && data.apartment === "Y") extraAddr += (extraAddr ? ", " : "") + data.buildingName;
        if (extraAddr) extraAddr = `(${extraAddr})`;
      }

      editWorker.value.address = addr;
      editWorker.value.extraAddress = extraAddr;

      setTimeout(() => {
        const el = document.querySelector('input[placeholder="상세주소"]');
        if (el) el.focus();
      }, 100);

      closeDaumPostcode();
    },
    width: "100%",
    height: "100%",
  }).embed(postcodeLayer.value);
};

// 신규 기사 저장
const saveNewWorker = () => {
  if (
    !newWorker.value.name ||
    !newWorker.value.workerId ||
    !newWorker.value.phone ||
    !newWorker.value.address ||
    !newWorker.value.joinDate ||
    !newWorker.value.vehicle ||
    !newWorker.value.region ||
    !newWorker.value.workStatus
  ) {
    alert("필수 항목을 모두 입력해주세요.");
    return;
  }

  const newId = Math.max(...workers.value.map((w) => w.id), 0) + 1;

  let formattedJoinDate = newWorker.value.joinDate;
  if (newWorker.value.joinDate) {
    const date = new Date(newWorker.value.joinDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    formattedJoinDate = `${year}-${month}-${day}`;
  }

  let formattedPhone = newWorker.value.phone;
  if (newWorker.value.phone && !newWorker.value.phone.includes("-")) {
    formattedPhone = newWorker.value.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  workers.value.push({
    id: newId,
    name: newWorker.value.name,
    workerId: newWorker.value.workerId,
    phone: formattedPhone,
    address: newWorker.value.address,
    joinDate: formattedJoinDate,
    vehicle: newWorker.value.vehicle,
    region: newWorker.value.region,
    workStatus: newWorker.value.workStatus,
  });

  alert("신규 기사가 추가되었습니다.");
  closeAddWorkerModal();
};

// 기사 수정 모달 열기
const openEditWorkerModal = (worker) => {
  editWorker.value = { ...worker };
  showEditWorkerModal.value = true;
};

// 기사 수정 모달 닫기
const closeEditWorkerModal = () => {
  showEditWorkerModal.value = false;
  editWorker.value = {};
};

// 기사 정보 저장
const saveWorkerChanges = () => {
  const idx = workers.value.findIndex((w) => w.id === editWorker.value.id);
  if (idx !== -1) {
    workers.value[idx] = { ...editWorker.value };
  }

  alert("기사 정보가 수정되었습니다.");
  closeEditWorkerModal();
};

// 연락처 형식 처리
const formatPhoneEdit = (e) => {
  let value = e.target.value.replace(/\D/g, "");
  let formatted = "";
  if (value.length <= 3) {
    formatted = value;
  } else if (value.length <= 7) {
    formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
  } else {
    formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
  }

  if (showAddWorkerModal.value) {
    newWorker.value.phone = formatted;
  } else if (showEditWorkerModal.value) {
    editWorker.value.phone = formatted;
  }
};
// 주소 검색 접기
const updateName = (event) => {
  nextTick(() => {
    name.value = event.target.value;
  });
};
</script>

<!-- 다음 주소 검색 스크립트 추가 -->
<style scoped>
th,
td {
  text-align: left;
}

tbody tr td[colspan] {
  text-align: center !important;
}
/* 다음 우편번호 팝업 고정 높이 */
.daum-postcode-wrap {
  height: 450px !important;
  max-height: 450px !important;
  overflow: hidden !important;
}

.daum-postcode-wrap iframe {
  height: 450px !important;
  max-height: 450px !important;
}
</style>
