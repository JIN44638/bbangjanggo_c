<template>
  <div class="faq" id="faq">
    <h3 :class="{ 'font-ja': locale === 'ja' }">{{ t("faq.title") }}</h3>
    <div class="inner faqinner">
      <div class="question">
        <ul class="faq-list">
          <li v-for="(item, index) in faqs" :key="index" class="faq-item">
            <div class="faq-question" @click="toggle(index)">
              <span class="faq-q">Q. {{ item.question }}</span>
            </div>
            <div
              class="faq-answer"
              :ref="(el) => setAnswerRef(el, index)"
              :style="{
                maxHeight: openedIndex === index ? heights[index] + 'px' : '0',
                opacity: openedIndex === index ? 1 : 0,
                paddingTop: openedIndex === index ? '12px' : '0',
                paddingBottom: openedIndex === index ? '12px' : '0',
              }">
              <div class="answer-content">
                <p>{{ item.answer }}</p>
                <p v-if="item.note" class="note">{{ item.note }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="chat">
        <div class="img-cht">
          <a href="#"><img src="/images/pjs/chat_icon.png" alt="chaticon" /></a>
        </div>
        <div class="chat-text">
          <a href="#">
            <p>채팅상담 바로가기</p>
            <p>카카오톡 1:1 문의</p>
            <h6>빠른상담 09시-20시</h6>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();

const faqs = [
  {
    question: "하루종일 짐을 보관 할 수 있나요?",
    answer: `보관은 24시간 보관 및 연장 가능합니다.
짐 보관 후 24시간이 지났으면 보관이 불가합니다.
참고 부탁드립니다.`,
  },
  {
    question: "동대구역 근처에 보관소가 있나요?",
    answer: `네! 동대구역에서 도보 5분거리에 있습니다.`,
  },
  {
    question: "무인보관함 어떻게 이용하나요?",
    answer: `저희 웹페이지 사이트에 예약 완료 후 입장하여
해당 QR코드 또는 예약번호로 입장 후 보관소를 이용합니다.
무인보관소이기 때문에 QR코드로 출입하셔서 짐만 보관하시면 됩니다.`,
  },
  {
    question: "별도 포장 서비스가 있나요?",
    answer: `별도 포장 서비스는 제공하지 않습니다.
다만, 아이스박스에 보관을 원하실 경우에는
구매하시고, 짐을 해당 박스에 넣어 보관하실 수 있습니다.`,
  },
  {
    question: "어떻게 예약을 변경하고 취소하나요?",
    answer: `마이페이지 → 예약 내역에서 변경 및 취소가 가능합니다.
변경 가능한 시간은 '입장전'까지만 가능합니다.`,
  },
  {
    question: "짐 이외의 물품도 보관이 가능한가요?",
    answer: `가능합니다!
단, 음식물 보관 및 기타 안전에 저해 요소가 있는 제품군은 보관이 제한됩니다. 예) 위험성이 큰 폭죽이나 휘발유 등.`,
  },
  {
    question: "보관 가능한 짐 크기는 얼마나 되나요?",
    answer: `한 칸의 보관함 사이즈는 기준 한 짐까지 가능합니다.
과하게 큰 짐은 보관이 어려울 수 있으니
가급적 일반 캐리어 짐 기준으로 가져와 주세요.
※ 캐리어 기준 : 가로 35cm x 세로 45cm x 높이 55cm`,
  },
];

const openedIndex = ref(null);
const heights = ref({});
const answerRefs = ref({});

function setAnswerRef(el, index) {
  if (el) {
    answerRefs.value[index] = el;
  }
}

function toggle(index) {
  openedIndex.value = openedIndex.value === index ? null : index;
}

onMounted(async () => {
  await nextTick();
  // 각 답변의 실제 높이를 계산
  Object.keys(answerRefs.value).forEach((key) => {
    const el = answerRefs.value[key];
    if (el) {
      const content = el.querySelector(".answer-content");
      if (content) {
        heights.value[key] = content.scrollHeight + 32; // padding 포함
      }
    }
  });
});
</script>

<style lang="scss" scoped>
@use "/src/assets/variables" as *;

.faq {
  padding: 0 20px;
  background-color: $bg-color;
  @media (max-width: 768px) {
    .faq {
      padding: 40px 20px;
    }
  }
  @media (max-width: 390px) {
    .faq {
      padding: 30px 20px;
    }
  }
  h3 {
    position: sticky;
    top: 60px;
    z-index: 5;
    background: linear-gradient(180deg, $bg-color 70%, transparent 100%);
    text-align: center;
    font-size: $title-font;
    font-family: "Cafe24Surround";
    color: $point-color;
    padding: 10px 0 50px;
    margin: 0;
    font-weight: bold;
    // 일본어일 때는 일본어를 지원하는 폰트 사용
    &.font-ja {
      font-family: "SpokaHanSansNeo", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif;
    }
  }
  @media (max-width: 768px) {
    h3 {
      padding-bottom: 40px;
    }
  }
  @media (max-width: 390px) {
    h3 {
      font-size: $f-a-q-text-font;
      padding-bottom: 30px;
    }
  }
  .faqinner {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 5%;
    max-width: 1000px;
    margin: auto;

    @media screen and (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      gap: 50px;
    }

    .question {
      width: 50%;
      max-width: none;

      @media screen and (max-width: 768px) {
        width: 80%;
        align-items: center;
        align-self: center;
      }
      @media screen and (max-width: 500px) {
        width: 90%;
      }

      .faq-list {
        width: 100%;
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .faq-item {
        width: 100%;
        // min-width: 250px;
        margin-bottom: 12px;
        border-radius: 12px;
        box-shadow: 0 2px 2px rgba(80, 49, 29, 0.1);
        background-color: #fff;
        overflow: hidden;

        .faq-question {
          // background-color: #fff;
          background-color: $main-color;
          padding: 14px 16px;
          font-weight: 500;
          font-family: "SpokaHanSansNeo";
          font-size: $desc-text-font;
          color: $font-color;
          cursor: pointer;
          user-select: none;

          &:hover {
            background-color: rgb(228, 207, 166);
          }
        }
        @media (max-width: 768px) {
          .faq-question {
            font-size: $notice-text-font;
          }
        }
        @media (max-width: 390px) {
          .faq-question {
            font-size: $mobile-notice-font;
            padding: 10px;
          }
        }
        .faq-answer {
          background-color: #fff;
          padding: 12px;
          font-family: "SpokaHanSansNeo";
          font-size: $desc-text-font;
          color: #333;
          overflow: hidden;
          transition: max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1),
            padding 0.45s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: max-height, opacity, padding;

          .answer-content {
            p {
              margin: 0;
              white-space: pre-line;
              line-height: 1.6;
              @media (max-width: 450px) {
                line-height: 1.2;
              }
            }

            .note {
              margin-top: 8px;
              font-size: 13px;
              color: #666;
            }
          }
        }
        @media (max-width: 1005px) {
          .faq-answer {
            font-size: $notice-text-font;
          }
        }
        @media (max-width: 768px) {
          .faq-answer {
            font-size: $notice-text-font;
          }
        }
        @media (max-width: 390px) {
          .faq-answer {
            font-size: $mobile-notice-font;
          }
        }
      }
    }

    .chat {
      width: 50%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      align-self: center;

      @media screen and (max-width: 768px) {
        width: 100%;
        flex-direction: row;
        justify-content: center;
      }

      .img-cht {
        max-width: 170px;
        a {
          display: block;
        }
        @media (max-width: 390px) {
          width: 90%;
          // min-width: 108px;
        }
        img {
          width: 100%;
          display: block;
        }
      }

      .chat-text {
        margin-top: 16px;

        a {
          display: flex;
          flex-direction: column;
          gap: 5px;
          text-decoration: none;
          @media (max-width: 768px) {
            margin-left: 20px;
          }
          @media (max-width: 405px) {
            margin-left: 0;
          }
          @media (max-width: 390px) {
            min-width: 145px;
          }
          p,
          h6 {
            color: $font-color;
            font-weight: 500;
            font-family: "SpokaHanSansNeo";
            font-size: $desc-text-font;
            margin: 0;
          }
          @media (max-width: 768px) {
            p,
            h6 {
              font-size: $notice-text-font;
            }
          }

          @media (max-width: 390px) {
            p,
            h6 {
              font-size: $mobile-notice-font;
            }
          }
        }
      }
    }
  }
}
</style>
