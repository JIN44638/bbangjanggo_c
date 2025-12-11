<template>
  <div class="faq" id="faq">
    <h3 :class="{ 'font-ja': locale === 'ja' }">{{ t("faq.title") }}</h3>
    <div class="inner faqinner">
      <div class="question">
        <ul class="faq-list">
          <li v-for="(item, index) in faqs" :key="index" class="faq-item">
            <div class="faq-question" @click="toggle(index)">
              <span class="faq-q">Q. {{ t(item.questionKey) }}</span>
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
                <p>{{ t(item.answerKey) }}</p>
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
            <p>{{ t("faq.chatTitle") }}</p>
            <p>{{ t("faq.chatSubtitle") }}</p>
            <h6>{{ t("faq.chatHours") }}</h6>
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
  { questionKey: "faq.q1", answerKey: "faq.a1" },
  { questionKey: "faq.q2", answerKey: "faq.a2" },
  { questionKey: "faq.q3", answerKey: "faq.a3" },
  { questionKey: "faq.q4", answerKey: "faq.a4" },
  { questionKey: "faq.q5", answerKey: "faq.a5" },
  { questionKey: "faq.q6", answerKey: "faq.a6" },
  { questionKey: "faq.q7", answerKey: "faq.a7" },
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
  Object.keys(answerRefs.value).forEach((key) => {
    const el = answerRefs.value[key];
    if (el) {
      const content = el.querySelector(".answer-content");
      if (content) {
        heights.value[key] = content.scrollHeight + 32;
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
