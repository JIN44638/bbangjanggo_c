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
          <option value="reservation">예약일자</option>
        </select>

        <input
          type="date"
          v-model="dateRange.start"
          :disabled="showTomorrowOnly"
          class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <span class="text-gray-500 dark:text-gray-400">~</span>

        <input
          type="date"
          v-model="dateRange.end"
          :disabled="showTomorrowOnly"
          class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="dateFilter"
            v-model="showTomorrowOnly"
            :disabled="dateRange.start !== '' || dateRange.end !== ''"
            class="w-4 h-4 text-[#E67E50] border-gray-300 rounded"
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
            <option value="예약완료">예약완료</option>
            <option value="배차완료">배차완료</option>
            <option value="입고완료">입고완료</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 예약 목록 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs">
      <div class="px-7 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">예약목록</h2>

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

      <div class="overflow-x-auto">
        <table
          class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          style="border-collapse: collapse; table-layout: fixed"
        >
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-8 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 80px"
              >
                예약번호
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 110px"
              >
                고객명
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 110px"
              >
                연락처
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 110px"
              >
                보관지점
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 110px"
              >
                예약일자
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 85px"
              >
                픽업시간
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 85px"
              >
                상태
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 110px"
              >
                배정기사님
              </th>
              <th
                class="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase"
                style="min-width: 110px"
              >
                배차상태
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
              v-for="item in paginatedData"
              :key="item.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              @click="handleRowClick(item)"
            >
              <td class="px-8 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 80px">
                {{ item.id }}
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 110px">
                {{ item.customerName }}
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 110px">
                {{ item.phone }}
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 110px">
                {{ item.storagePoint }}
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 110px">
                {{ item.reservationDate }}
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 85px">
                {{ item.pickupTime }}
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 85px">
                <Badge :type="item.status" :label="item.status" />
              </td>

              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 110px">
                <span v-if="!item.isEditing" @click.stop="handleDriverClick(item)" class="cursor-pointer">
                  <Badge :type="item.driver === '미배정' ? '미배정' : 'driver'" :label="item.driver" />
                </span>

                <select
                  v-else
                  v-model="item.driver"
                  @change="updateDriver(item)"
                  @blur="cancelEdit(item)"
                  @click.stop
                  ref="driverSelect"
                  class="px-1 py-0.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs h-6"
                  style="min-height: 24px; line-height: 1.2"
                >
                  <option value="미배정">미배정</option>
                  <option value="김지산">김지산</option>
                  <option value="이서윤">이서윤</option>
                  <option value="박민우">박민우</option>
                  <option value="한나리">한나리</option>
                  <option value="윤예린">윤예린</option>
                  <option value="한나연">한나연</option>
                  <option value="정도윤">정도윤</option>
                  <option value="오시우">오시우</option>
                  <option value="권하진">권하진</option>
                </select>
              </td>
              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 110px">
                <Badge :type="item.dispatchStatus" :label="item.dispatchStatus" />
              </td>

              <td class="px-5 py-3 text-sm text-gray-900 dark:text-white" style="min-width: 60px; padding-right: 10px">
                <button
                  @click="openDispatchModal(item)"
                  class="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-xs"
                >
                  수정
                </button>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr>
              <td :colspan="10" class="text-center text-gray-400 py-4">조건에 맞는 예약 내역이 없습니다.</td>
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
    <div class="flex justify-end gap-3 pr-5">
      <button
        @click="openAddReservationModal"
        class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
      >
        예약등록
      </button>
    </div>

    <!-- 예약등록 모달 -->
    <div v-if="showAddReservationModal" class="fixed inset-0 bg-gray-500/75 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs max-w-xl w-full">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">예약 등록</h3>
          <button @click="closeAddReservationModal" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-8">
          <div class="space-y-4">
            <div class="flex space-x-4">
              <!-- 왼쪽 -->
              <div class="flex-1 space-y-4">
                <!-- 고객명 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">고객명</label>
                  <input
                    v-model="newReservation.customerName"
                    type="text"
                    placeholder="고객명을 입력하세요"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <!-- 연락처 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">연락처</label>
                  <input
                    v-model="newReservation.phone"
                    type="tel"
                    @input="formatPhoneAdd"
                    placeholder="010-0000-0000"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <!-- 보관지점 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">보관지점</label>
                  <select
                    v-model="newReservation.storagePoint"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">선택하세요</option>
                    <option value="경대병원역점">경대병원역점</option>
                    <option value="동대구역점">동대구역점</option>
                    <option value="서대구역점">서대구역점</option>
                    <option value="대구공항점">대구공항점</option>
                    <option value="반월당역점">반월당역점</option>
                  </select>
                </div>

                <!-- 상태 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">상태</label>
                  <select
                    v-model="newReservation.status"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">선택하세요</option>
                    <option value="실온">실온</option>
                    <option value="냉장">냉장</option>
                    <option value="냉동">냉동</option>
                  </select>
                </div>
              </div>

              <!-- 오른쪽 -->
              <div class="flex-1 space-y-4">
                <!-- 예약일자 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">예약일자</label>
                  <input
                    v-model="newReservation.reservationDate"
                    type="date"
                    :min="getToday()"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <!-- 픽업시간 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">픽업시간</label>
                  <input
                    v-model="newReservation.pickupTime"
                    type="time"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <!-- 배정기사님 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">배정기사님</label>
                  <select
                    v-model="newReservation.driver"
                    @change="updateNewReservationDispatchStatus"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="미배정">미배정</option>
                    <option value="김지산">김지산</option>
                    <option value="이서윤">이서윤</option>
                    <option value="박민우">박민우</option>
                    <option value="한나리">한나리</option>
                    <option value="윤예린">윤예린</option>
                    <option value="한나연">한나연</option>
                    <option value="정도윤">정도윤</option>
                    <option value="오시우">오시우</option>
                    <option value="권하진">권하진</option>
                  </select>
                </div>

                <!-- 배차상태 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">배차상태</label>
                  <input
                    v-model="newReservation.dispatchStatus"
                    type="text"
                    disabled
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 모달 하단 버튼들 -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end gap-3">
          <button
            @click="closeAddReservationModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            취소
          </button>
          <button
            @click="saveNewReservation"
            class="px-4 py-2 bg-[#E67E50] hover:bg-[#d16f45] text-white rounded-md text-sm font-medium"
          >
            추가
          </button>
        </div>
      </div>
    </div>

    <!-- 배차수정 모달 -->
    <div v-if="showDispatchModal" class="fixed inset-0 bg-gray-500/75 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xs max-w-xl w-full">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">예약 수정</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="p-8">
          <div class="space-y-4">
            <div class="flex space-x-4">
              <!-- 비활성화된 영역 (왼쪽) -->
              <div class="flex-1 space-y-4">
                <!-- 예약번호 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">예약번호</label>
                  <input
                    v-model="selectedReservation.id"
                    type="text"
                    disabled
                    class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <!-- 고객명 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">고객명</label>
                  <input
                    v-model="selectedReservation.customerName"
                    type="text"
                    disabled
                    class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <!-- 연락처 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">연락처</label>
                  <input
                    v-model="selectedReservation.phone"
                    type="text"
                    disabled
                    class="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <!-- 상태 (셀렉트 박스로 변경) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">상태</label>
                  <select
                    v-model="selectedReservation.status"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="실온">실온</option>
                    <option value="냉장">냉장</option>
                    <option value="냉동">냉동</option>
                    <option value="취소">취소</option>
                  </select>
                </div>
              </div>

              <!-- 선택가능한 영역 (오른쪽) -->
              <div class="flex-1 space-y-4">
                <!-- 배정기사님 (셀렉트 박스로 변경) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">배정기사님</label>
                  <select
                    v-model="selectedReservation.driver"
                    @change="updateModalDriver"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="미배정">미배정</option>
                    <option value="김지산">김지산</option>
                    <option value="이서윤">이서윤</option>
                    <option value="박민우">박민우</option>
                    <option value="한나리">한나리</option>
                    <option value="윤예린">윤예린</option>
                    <option value="한나연">한나연</option>
                    <option value="정도윤">정도윤</option>
                    <option value="오시우">오시우</option>
                    <option value="권하진">권하진</option>
                  </select>
                </div>
                <!-- 배차상태 (셀렉트 박스로 변경) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">배차상태</label>
                  <select
                    v-model="selectedReservation.dispatchStatus"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="예약완료">예약완료</option>
                    <option value="배차완료">배차완료</option>
                    <option value="입고완료">입고완료</option>
                  </select>
                </div>
                <!-- 보관지점 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">보관지점</label>
                  <select
                    v-model="selectedReservation.storagePoint"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="경대병원역점">경대병원역점</option>
                    <option value="동대구역점">동대구역점</option>
                    <option value="서대구역점">서대구역점</option>
                    <option value="대구공항점">대구공항점</option>
                    <option value="반월당역점">반월당역점</option>
                  </select>
                </div>

                <!-- 예약일자 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">예약일자</label>
                  <input
                    v-model="selectedReservation.reservationDate"
                    type="date"
                    :min="getToday()"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>

                <!-- 픽업시간 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">픽업시간</label>
                  <input
                    v-model="selectedReservation.pickupTime"
                    type="time"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 모달 하단 버튼들 -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end gap-3">
          <!-- 예약 취소 버튼 -->
          <button
            @click="confirmCancelReservation"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            예약 취소
          </button>

          <!-- 저장 버튼 -->
          <button
            @click="saveDispatchChanges"
            class="px-4 py-2 bg-[#E67E50] hover:bg-[#d16f45] text-white rounded-md text-sm font-medium"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DashboardStats from "@/components/DashboardStats.vue";
import Pagination from "@/components/Pagination.vue";
import Badge from "@/components/Badge.vue";
import { ref, computed } from "vue";

// 기존 통계 카드 데이터
const reservationStats = ref([
  { title: "오늘 예약 건수", value: "0건", icon: "fas fa-clock", bgColor: "bg-gray-100 dark:bg-gray-700" },
  {
    title: "진행중 (배차 신청 완료)",
    value: "0 건",
    icon: "fas fa-layer-group",
    bgColor: "bg-gray-100 dark:bg-gray-700",
  },
  { title: "입고완료", value: "0 건", icon: "fas fa-calendar-check", bgColor: "bg-gray-100 dark:bg-gray-700" },
  { title: "취소 / 환불건", value: "0건", icon: "fas fa-users", bgColor: "bg-gray-100 dark:bg-gray-700" },
]);

// 오늘 날짜 구하기
const getToday = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 상태별 예약 건수 계산
const stats = computed(() => {
  const today = getToday();
  const todayReservations = reservations.value.filter((r) => r.reservationDate === today).length;
  const inProgress = reservations.value.filter((r) => r.dispatchStatus === "배차완료").length;
  const inStock = reservations.value.filter((r) => r.dispatchStatus === "입고완료").length;
  const cancelled = reservations.value.filter((r) => r.dispatchStatus === "취소").length;

  return [
    { ...reservationStats.value[0], value: `${todayReservations}건` },
    { ...reservationStats.value[1], value: `${inProgress} 건` },
    { ...reservationStats.value[2], value: `${inStock} 건` },
    { ...reservationStats.value[3], value: `${cancelled}건` },
  ];
});

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
const showAddReservationModal = ref(false);
const selectedReservation = ref({});

// 신규 예약 데이터
const newReservation = ref({
  customerName: "",
  phone: "",
  storagePoint: "",
  reservationDate: "",
  pickupTime: "",
  status: "",
  driver: "미배정",
  dispatchStatus: "예약완료",
});

// 페이지네이션
const currentPage = ref(1);
const itemsPerPage = 9;

// 50명의 더미 데이터 생성
const generateDummyData = () => {
  const names = [
    "이준호", "박해린", "정혜린", "오지은", "최일도", "한지현", "김도현", "송혜나", "박민석", "윤서아",
    "강민준", "이서윤", "김지우", "박서준", "최예은", "정하준", "한소희", "임시우", "조유진", "신지훈",
    "홍다은", "장민서", "오준영", "백서현", "권도윤", "남주아", "문재윤", "양하늘", "하은비", "서동현",
    "류예린", "안시후", "손채원", "곽민재", "노지안", "탁수빈", "마서진", "진아린", "도현우", "석예나",
    "설지호", "표수아", "감민지", "방준혁", "김서영", "복지훈", "지예슬", "배현성", "고다인", "성지율",
  ];

  const storagePoints = ["경대병원역점", "동대구역점", "서대구역점", "대구공항점", "반월당역점"];
  const statuses = ["실온", "냉장", "냉동"];
  const dispatchStatuses = ["예약완료", "배차완료", "입고완료"];
  const drivers = ["김지산", "이서윤", "박민우", "한나리", "윤예린", "한나연", "정도윤", "오시우", "권하진", "미배정"];

  const data = [];
  for (let i = 1; i <= 50; i++) {
    const startDate = new Date(2025, 10, 26);
    const endDate = new Date(2025, 11, 13);
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate - startDate));
    const dispatchStatus = dispatchStatuses[Math.floor(Math.random() * dispatchStatuses.length)];
    const hour = String(10 + Math.floor(i / 5)).padStart(2, "0");
    const minute = String((i * 10) % 60).padStart(2, "0");
    const driver = dispatchStatus === "예약완료" ? "미배정" : drivers[Math.floor(Math.random() * (drivers.length - 1))];
    
    data.push({
      id: `${10230 + i}`,
      customerName: names[i - 1],
      phone: `010-${1000 + Math.floor(Math.random() * 9000)}-${1000 + Math.floor(Math.random() * 9000)}`,
      storagePoint: storagePoints[Math.floor(Math.random() * storagePoints.length)],
      reservationDate: randomDate.toISOString().split("T")[0],
      pickupTime: `${hour}:${minute}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      driver,
      dispatchStatus,
      isEditing: false,
    });
  }
  return data;
};

const reservations = ref(generateDummyData());

// 검색 입력 처리
function handleInput(e) {
  searchQuery.value = e.target.value;
}

// 내일 날짜 계산
const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 필터링된 데이터
const filteredData = computed(() => {
  let result = [...reservations.value];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((r) => r.customerName.toLowerCase().includes(q) || r.id.includes(q));
  }

  if (showTomorrowOnly.value) {
    result = result.filter((r) => r.reservationDate === getTomorrow());
  }

  if (dateRange.value.start && dateRange.value.end) {
    result = result.filter((item) => {
      const itemDate = item.reservationDate;
      return itemDate >= dateRange.value.start && itemDate <= dateRange.value.end;
    });
  }

  if (statusFilter.value !== "all") {
    result = result.filter((r) => r.status === statusFilter.value);
  }

  if (dispatchFilter.value !== "all") {
    result = result.filter((r) => r.dispatchStatus === dispatchFilter.value);
  }

  result.sort((a, b) =>
    sortOrder.value === "latest"
      ? new Date(b.reservationDate) - new Date(a.reservationDate)
      : new Date(a.reservationDate) - new Date(b.reservationDate)
  );
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
const handleRowClick = (item) => {
  selectedReservation.value = { ...item };
};

// 예약등록 모달 열기
const openAddReservationModal = () => {
  showAddReservationModal.value = true;
};

// 예약등록 모달 닫기
const closeAddReservationModal = () => {
  showAddReservationModal.value = false;
  newReservation.value = {
    customerName: "",
    phone: "",
    storagePoint: "",
    reservationDate: "",
    pickupTime: "",
    status: "",
    driver: "미배정",
    dispatchStatus: "예약완료",
  };
};

// 연락처 형식 처리
const formatPhoneAdd = (e) => {
  let value = e.target.value.replace(/\D/g, "");
  let formatted = "";
  if (value.length <= 3) {
    formatted = value;
  } else if (value.length <= 7) {
    formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
  } else {
    formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
  }
  newReservation.value.phone = formatted;
};

// 신규 예약 저장
const saveNewReservation = () => {
  if (
    !newReservation.value.customerName ||
    !newReservation.value.phone ||
    !newReservation.value.storagePoint ||
    !newReservation.value.reservationDate ||
    !newReservation.value.pickupTime ||
    !newReservation.value.status
  ) {
    alert("필수 항목을 모두 입력해주세요.");
    return;
  }

  const newId = String(Math.max(...reservations.value.map((r) => parseInt(r.id)), 10230) + 1);

  reservations.value.push({
    id: newId,
    customerName: newReservation.value.customerName,
    phone: newReservation.value.phone,
    storagePoint: newReservation.value.storagePoint,
    reservationDate: newReservation.value.reservationDate,
    pickupTime: newReservation.value.pickupTime,
    status: newReservation.value.status,
    driver: newReservation.value.driver,
    dispatchStatus: newReservation.value.dispatchStatus,
    isEditing: false,
  });

  alert("신규 예약이 등록되었습니다.");
  closeAddReservationModal();
};

// 배정기사 선택 시 배차상태 자동 변경
const updateNewReservationDispatchStatus = () => {
  if (newReservation.value.driver === "미배정") {
    newReservation.value.dispatchStatus = "예약완료";
  } else {
    newReservation.value.dispatchStatus = "배차완료";
  }
};

// 배차수정 모달 열기
const openDispatchModal = (item) => {
  selectedReservation.value = { ...item };
  showDispatchModal.value = true;
};

// 배차수정 저장
const saveDispatchChanges = () => {
  const index = reservations.value.findIndex((r) => r.id === selectedReservation.value.id);
  if (index !== -1) {
    if (selectedReservation.value.status === "취소") {
      selectedReservation.value.dispatchStatus = "취소";
    }
    reservations.value[index] = { ...selectedReservation.value };
  }

  showDispatchModal.value = false;
  alert("배차 정보가 수정되었습니다.");
};

// 기사명 클릭 처리
const handleDriverClick = (item) => {
  if (item.dispatchStatus === "입고완료") {
    return;
  }
  item.previousDriver = item.driver;
  item.isEditing = true;
};

// 셀렉트 박스 취소 처리
const cancelEdit = (item) => {
  setTimeout(() => {
    item.isEditing = false;
  }, 100);
};

// 기사 변경 시 호출
const updateDriver = (item) => {
  if (item.driver === item.previousDriver) {
    item.isEditing = false;
    return;
  }

  item.isEditing = false;

  setTimeout(() => {
    if (item.driver === "미배정") {
      item.dispatchStatus = "예약완료";
      alert("기사가 미배정 상태가 되었습니다.\n다시 배정해주세요.");
    } else {
      item.dispatchStatus = "배차완료";
      alert(`${item.driver} 기사로 수정되었습니다.`);
    }
  }, 50);
};

// 예약 취소 처리
const confirmCancelReservation = () => {
  if (confirm(`예약번호 ${selectedReservation.value.customerName}님의 예약을 취소하시겠습니까?`)) {
    const index = reservations.value.findIndex((r) => r.id === selectedReservation.value.id);
    if (index !== -1) {
      reservations.value[index].dispatchStatus = "취소";
    }

    selectedReservation.value.dispatchStatus = "취소";
    showDispatchModal.value = false;

    alert("예약이 취소되었습니다.");
  }
};

// 모달에서 기사 선택 변경 시 배차상태 자동 변경
const updateModalDriver = () => {
  if (selectedReservation.value.driver === "미배정") {
    selectedReservation.value.dispatchStatus = "예약완료";
  } else {
    selectedReservation.value.dispatchStatus = "배차완료";
  }
};

// 모달 닫기
const closeModal = () => {
  showDispatchModal.value = false;
};
</script>

<style scoped>
th,
td {
  text-align: left;
}

tbody tr td[colspan] {
  text-align: center !important;
}
</style>