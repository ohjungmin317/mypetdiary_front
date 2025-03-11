<template>
  <div class="pet-diary">
    <!-- 헤더 -->
    <header class="header">
      <h1 class="title">My Pet Diary</h1>
      <div class="header-actions">
        <button class="logout-text-btn logout-btn">🔓 Logout</button>
        <button class="menu-text-btn menu-btn" @click="toggleMenu">
          📋 Menu
        </button>
      </div>
    </header>

    <!-- 투명 메뉴바 -->
    <div class="transparent-menu" v-if="showMenu">
      <h3 class="transparent-menu-title">나만의 일기</h3>
      <div class="transparent-menu-item">
        <span class="menu-icon">📔</span> 일기장
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="content-container">
      <!-- 사이드바 -->
      <aside class="sidebar">
        <div class="pet-avatar">
          <img
            src="@/assets/image/dog.png"
            alt="반려동물 아바타"
            class="pet-image"
          />
        </div>
        <div class="pet-story">
          <h3 class="story-title">나의반려동물이야기</h3>
          <p class="story-subtitle">소개를 등록해주세요.</p>
        </div>
        <ul class="menu-list">
          <li
            class="menu-item hover-effect"
            :class="{ active: currentView === 'list' }"
            @click="currentView = 'list'"
          >
            <span class="menu-icon">📘</span> 내 일기장
          </li>
          <li
            class="menu-item hover-effect"
            :class="{ active: currentView === 'write' }"
            @click="currentView = 'write'"
          >
            <span class="menu-icon">✏️</span> 일기 작성
          </li>
          <li class="menu-item hover-effect">
            <span class="menu-icon">👤</span> 프로필 설정
          </li>
          <li class="menu-item hover-effect">
            <span class="menu-icon">❌</span> 회원 탈퇴
          </li>
        </ul>
      </aside>

      <!-- 메인 영역 -->
      <main class="main-content">
        <!-- 일기 작성 뷰 -->
        <div v-if="currentView === 'write'">
          <h2 class="section-title">반려동물의 이야기를 작성해주세요.</h2>

          <!-- 일기 작성 폼 표시 -->
          <div v-if="isWritingDiary" class="diary-form-container">
            <div class="diary-form">
              <div class="form-header">
                <div class="form-title">
                  <label for="title">제목</label>
                  <input
                    type="text"
                    v-model="diaryTitle"
                    id="title"
                    placeholder="오늘의 특별한 순간을 제목으로 남겨보세요"
                    class="title-input"
                  />
                </div>

                <div class="date-section">
                  <div class="selected-date">
                    <span class="date-label">날짜</span>
                    <span class="date-value">{{ formattedSelectedDate }}</span>
                  </div>
                  <button class="calendar-toggle" @click="toggleCalendar">
                    <span v-if="!showCalendar">📅 달력 열기</span>
                    <span v-else>📅 달력 닫기</span>
                  </button>
                </div>
              </div>

              <!-- 커스텀 달력 -->
              <div v-if="showCalendar" class="custom-calendar">
                <div class="calendar-header">
                  <button @click="prevMonth" class="calendar-nav-btn">◀</button>
                  <h3>{{ currentMonthName }} {{ currentYear }}</h3>
                  <button @click="nextMonth" class="calendar-nav-btn">▶</button>
                </div>
                <div class="calendar-days">
                  <div class="weekday" v-for="day in weekdays" :key="day">
                    {{ day }}
                  </div>
                </div>
                <div class="calendar-dates">
                  <div
                    v-for="date in calendarDates"
                    :key="date.day"
                    class="calendar-date"
                    :class="{
                      'other-month': !date.currentMonth,
                      selected: isSelectedDate(date),
                      today: isToday(date),
                    }"
                    @click="selectDate(date)"
                  >
                    {{ date.day }}
                  </div>
                </div>
              </div>

              <div class="mood-weather-section">
                <div class="mood-selector">
                  <label>반려동물의 기분 <span class="required">*</span></label>
                  <div class="mood-options">
                    <div
                      v-for="(mood, index) in moods"
                      :key="index"
                      class="mood-option"
                      :class="{ selected: selectedMood === mood.value }"
                      @click="selectedMood = mood.value"
                    >
                      <span class="mood-emoji">{{ mood.emoji }}</span>
                      <span class="mood-label">{{ mood.label }}</span>
                    </div>
                  </div>
                  <span v-if="formErrors.mood" class="error-message">기분을 선택해주세요</span>
                </div>

                <div class="weather-selector">
                  <label>오늘의 날씨 <span class="required">*</span></label>
                  <div class="weather-options">
                    <div
                      v-for="(weather, index) in weathers"
                      :key="index"
                      class="weather-option"
                      :class="{ selected: selectedWeather === weather.value }"
                      @click="selectedWeather = weather.value"
                    >
                      <span class="weather-emoji">{{ weather.emoji }}</span>
                      <span class="weather-label">{{ weather.label }}</span>
                    </div>
                  </div>
                  <span v-if="formErrors.weather" class="error-message">날씨를 선택해주세요</span>
                </div>
              </div>

              <div class="content-section">
                <label for="content">일기 내용</label>
                <textarea
                  v-model="diaryContent"
                  id="content"
                  placeholder="오늘 반려동물과 함께한 특별한 순간들을 기록해보세요..."
                  class="content-textarea"
                ></textarea>
              </div>

              <div class="image-upload-section">
                <label>사진 추가</label>
                <div class="image-upload-area" @click="triggerFileInput">
                  <input
                    type="file"
                    ref="fileInput"
                    accept="image/*"
                    style="display: none"
                    @change="handleFileUpload"
                  />
                  <div v-if="!previewImage" class="upload-placeholder">
                    <span class="upload-icon">📷</span>
                    <span>클릭하여 사진 추가</span>
                  </div>
                  <img v-else :src="previewImage" class="preview-image" />
                </div>
                <button
                  v-if="previewImage"
                  @click="removeImage"
                  class="remove-image-btn"
                >
                  사진 삭제
                </button>
              </div>

              <div class="diary-actions">
                <button class="cancel-btn" @click="cancelWritingDiary">
                  취소
                </button>
                <button
                  class="confirm-btn"
                  @click="saveDiary"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? "저장 중..." : "저장하기" }}
                </button>
              </div>
            </div>
          </div>

          <!-- 일기 작성하지 않으면 표시될 메시지 -->
          <div v-else class="empty-diary">
            <button class="write-diary-btn" @click="startWritingDiary">
              일기 작성하기
            </button>
          </div>
        </div>

        <!-- 일기 목록 뷰 -->
        <div v-else-if="currentView === 'list'">
          <h2 class="section-title">내 일기장</h2>

          <!-- 일기 목록 -->
          <div v-if="diaries.length > 0" class="diary-list">
            <div
              v-for="(diary, index) in diaries"
              :key="index"
              class="diary-card"
            >
              <div class="diary-card-header">
                <div class="diary-info">
                  <h3 class="diary-title">{{ diary.title }}</h3>
                  <p class="diary-date">{{ formatDate(diary.date) }}</p>
                </div>
                <div class="diary-mood-weather">
                  <span class="diary-mood">{{ getMoodEmoji(diary.mood) }}</span>
                  <span class="diary-weather">{{
                    getWeatherEmoji(diary.weather)
                  }}</span>
                </div>
              </div>

              <div class="diary-card-content">
                <p class="diary-content">
                  {{ truncateContent(diary.content) }}
                </p>
                <div v-if="diary.image" class="diary-image-container">
                  <img
                    :src="diary.image"
                    alt="일기 이미지"
                    class="diary-image"
                  />
                </div>
              </div>

              <div class="diary-card-actions">
                <button class="edit-btn" @click="editDiary(diary)">수정</button>
                <button class="delete-btn" @click="confirmDelete(diary)">
                  삭제
                </button>
              </div>
            </div>
          </div>

          <!-- 일기가 없을 때 표시될 메시지 -->
          <div v-else class="empty-diary">
            <p class="empty-message">
              등록된 일기가 없습니다. 일기를 작성해주세요.
            </p>
            <button class="write-diary-btn" @click="goToWriteDiary">
              일기 작성하기
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- 일기 수정 모달 -->
    <div v-if="isEditingDiary" class="edit-modal-overlay">
      <div class="edit-modal">
        <div class="edit-modal-header">
          <h3>일기 수정하기</h3>
          <button class="close-btn" @click="cancelEdit">×</button>
        </div>

        <div class="edit-modal-content">
          <div class="form-group">
            <label for="edit-title">제목</label>
            <input
              type="text"
              id="edit-title"
              v-model="editingDiary.title"
              class="edit-input"
            />
          </div>

          <div class="form-group">
            <label for="edit-date">날짜 <span class="required">*</span></label>
            <input
              type="date"
              id="edit-date"
              v-model="editingDiary.dateString"
              class="edit-input"
            />
          </div>

          <div class="form-group mood-weather-edit">
            <div class="mood-selector">
              <label>반려동물의 기분 <span class="required">*</span></label>
              <div class="mood-options">
                <div
                  v-for="mood in moods"
                  :key="mood.value"
                  class="mood-option"
                  :class="{ selected: editingDiary.mood === mood.value }"
                  @click="editingDiary.mood = mood.value"
                >
                  <span class="mood-emoji">{{ mood.emoji }}</span>
                  <span class="mood-label">{{ mood.label }}</span>
                </div>
              </div>
              <span v-if="editFormErrors.mood" class="error-message">기분을 선택해주세요</span>
            </div>

            <div class="weather-selector">
              <label>오늘의 날씨 <span class="required">*</span></label>
              <div class="weather-options">
                <div
                  v-for="weather in weathers"
                  :key="weather.value"
                  class="weather-option"
                  :class="{ selected: editingDiary.weather === weather.value }"
                  @click="editingDiary.weather = weather.value"
                >
                  <span class="weather-emoji">{{ weather.emoji }}</span>
                  <span class="weather-label">{{ weather.label }}</span>
                </div>
              </div>
              <span v-if="editFormErrors.weather" class="error-message">날씨를 선택해주세요</span>
            </div>
          </div>

          <div class="form-group">
            <label for="edit-content">내용</label>
            <textarea
              id="edit-content"
              v-model="editingDiary.content"
              class="edit-textarea"
            ></textarea>
          </div>

          <div class="form-group">
            <label>사진</label>
            <div class="image-upload-area" @click="triggerEditFileInput">
              <input
                type="file"
                ref="editFileInput"
                accept="image/*"
                style="display: none"
                @change="handleEditFileUpload"
              />
              <div v-if="!editingDiary.image" class="upload-placeholder">
                <span class="upload-icon">📷</span>
                <span>클릭하여 사진 추가</span>
              </div>
              <img v-else :src="editingDiary.image" class="preview-image" />
            </div>
            <button
              v-if="editingDiary.image"
              @click="removeEditImage"
              class="remove-image-btn"
            >
              사진 삭제
            </button>
          </div>
        </div>

        <div class="edit-modal-actions">
          <div class="edit-modal-footer">
            <button class="save-btn" @click="saveEdit" :disabled="isSubmitting">
              {{ isSubmitting ? "저장 중..." : "저장" }}
            </button>
            <button class="cancel-btn" @click="cancelEdit">취소</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteConfirm" class="delete-modal-overlay">
      <div class="delete-modal">
        <div class="delete-modal-content">
          <h3>정말 삭제하시겠습니까?</h3>
          <p>삭제된 일기는 복구할 수 없습니다.</p>
        </div>
        <div class="delete-modal-actions">
          <button class="delete-cancel-btn" @click="cancelDelete">취소</button>
          <button
            class="delete-confirm-btn"
            @click="deleteDiary"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "삭제 중..." : "삭제" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import axios from "axios";

// 반응형 상태 정의
const currentView = ref("write"); // 현재 보기 (write: 일기 작성, list: 일기 목록)
const hasDiaries = ref(false);
const showMenu = ref(false);
const isWritingDiary = ref(false); // 일기 작성 폼 표시 여부
const diaryTitle = ref(""); // 일기 제목
const diaryContent = ref(""); // 일기 내용
const showCalendar = ref(false); // 달력 표시 여부
const fileInput = ref(null);
const editFileInput = ref(null);
const previewImage = ref(null);
const isEditingDiary = ref(false);
const editingDiary = ref({});
const editingIndex = ref(-1);
const showDeleteConfirm = ref(false);
const diaryToDelete = ref(null);
const isLoading = ref(false); // 로딩 상태 추가
const isSubmitting = ref(false); // 제출 상태 추가

// 폼 유효성 검사를 위한 에러 상태
const formErrors = reactive({
  mood: false,
  weather: false
});

// 수정 폼 유효성 검사를 위한 에러 상태
const editFormErrors = reactive({
  mood: false,
  weather: false,
  date: false
});

// API 기본 URL 설정
const API_URL = "http://localhost:5173/api/diaries/creatediary";

const diaries = ref([]); // 초기 일기 목록을 빈 배열로 설정

// 날짜 관련 상태
const currentDate = ref(new Date());
const selectedDate = ref(new Date());
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

// 기분 및 날씨 옵션
const selectedMood = ref("happy"); // 기본값 설정
const selectedWeather = ref("sunny"); // 기본값 설정

const moods = [
  { emoji: "😊", label: "행복", value: "happy" },
  { emoji: "😴", label: "졸림", value: "sleepy" },
  { emoji: "🥰", label: "사랑", value: "love" },
  { emoji: "😢", label: "슬픔", value: "sad" },
  { emoji: "😡", label: "화남", value: "angry" },
  { emoji: "😲", label: "놀람", value: "surprise" },
  { emoji: "🤤", label: "배고픔", value: "hungry" },
  { emoji: "🤒", label: "아픔", value: "sick" },
];

const weathers = [
  { emoji: "☀️", label: "맑음", value: "sunny" },
  { emoji: "☁️", label: "흐림", value: "cloudy" },
  { emoji: "🌧️", label: "비", value: "rainy" },
  { emoji: "❄️", label: "눈", value: "snowy" },
  { emoji: "🌫️", label: "안개", value: "foggy" },
  { emoji: "⚡", label: "낙뢰", value: "light" },
  { emoji: "🌪️", label: "태풍", value: "storm" },
  { emoji: "🍃", label: "바람", value: "wind" },
];

// 요일 이름
const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

// 현재 월 이름 계산
const currentMonthName = computed(() => {
  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  return months[currentMonth.value];
});

// 선택된 날짜 포맷
const formattedSelectedDate = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth() + 1;
  const day = selectedDate.value.getDate();
  return `${year}년 ${month}월 ${day}일`;
});

// 달력 날짜 계산
const calendarDates = computed(() => {
  const dates = [];

  // 현재 월의 첫 날과 마지막 날
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);

  // 현재 달의 날짜들만 추가
  for (let i = 1; i <= lastDay.getDate(); i++) {
    dates.push({
      day: i,
      month: currentMonth.value,
      year: currentYear.value,
      currentMonth: true,
    });
  }

  return dates;
});

// 메뉴 토글 함수
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

// 달력 토글 함수
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
};

// 이전 달로 이동
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

// 다음 달로 이동
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// 날짜 선택
const selectDate = (date) => {
  selectedDate.value = new Date(date.year, date.month, date.day);
};

// 선택된 날짜인지 확인
const isSelectedDate = (date) => {
  return (
    date.day === selectedDate.value.getDate() &&
    date.month === selectedDate.value.getMonth() &&
    date.year === selectedDate.value.getFullYear()
  );
};

// 오늘 날짜인지 확인
const isToday = (date) => {
  const today = new Date();
  return (
    date.day === today.getDate() &&
    date.month === today.getMonth() &&
    date.year === today.getFullYear()
  );
};

// 파일 업로드 트리거
const triggerFileInput = () => {
  fileInput.value.click();
};

// 파일 업로드 처리
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 이미지 제거
const removeImage = () => {
  previewImage.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// 일기 작성 시작
const startWritingDiary = () => {
  isWritingDiary.value = true;
  // 오늘 날짜로 초기화
  selectedDate.value = new Date();
  currentMonth.value = selectedDate.value.getMonth();
  currentYear.value = selectedDate.value.getFullYear();
  
  // 기본값 설정
  selectedMood.value = "happy";
  selectedWeather.value = "sunny";
  
  // 에러 초기화
  formErrors.mood = false;
  formErrors.weather = false;
};

// 폼 유효성 검사
const validateForm = () => {
  let isValid = true;
  
  // 기분 검사
  if (!selectedMood.value) {
    formErrors.mood = true;
    isValid = false;
  } else {
    formErrors.mood = false;
  }
  
  // 날씨 검사
  if (!selectedWeather.value) {
    formErrors.weather = true;
    isValid = false;
  } else {
    formErrors.weather = false;
  }
  
  return isValid;
};

// 수정 폼 유효성 검사
const validateEditForm = () => {
  let isValid = true;
  
  // 날짜 검사
  if (!editingDiary.value.dateString) {
    editFormErrors.date = true;
    isValid = false;
  } else {
    editFormErrors.date = false;
  }
  
  // 기분 검사
  if (!editingDiary.value.mood) {
    editFormErrors.mood = true;
    isValid = false;
  } else {
    editFormErrors.mood = false;
  }
  
  // 날씨 검사
  if (!editingDiary.value.weather) {
    editFormErrors.weather = true;
    isValid = false;
  } else {
    editFormErrors.weather = false;
  }
  
  return isValid;
};

// 일기 저장 함수 - axios 통신 추가
const saveDiary = async () => {
  // 폼 유효성 검사
  if (!validateForm()) {
    return;
  }
  
  // 제출 상태 시작
  isSubmitting.value = true;
  
  try {
    // 날짜 형식 변환 (YYYY-MM-DD 형식으로)
    const year = selectedDate.value.getFullYear();
    const month = String(selectedDate.value.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.value.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    // 새 일기 객체 생성
    const newDiary = {
      title: diaryTitle.value || "무제",
      date: formattedDate, // 형식 변경
      content: diaryContent.value || "",
      mood: selectedMood.value,
      weather: selectedWeather.value,
    };
    
    console.log("저장할 일기 데이터:", newDiary); // 디버깅용 로그
    
    // axios를 사용하여 서버로 일기 데이터 전송
    const response = await axios.post(API_URL, newDiary);
    
    console.log("서버 응답:", response.data); // 디버깅용 로그

    // 서버에서 반환한 데이터로 일기 객체 생성
    const savedDiary = {
      ...response.data,
      date: new Date(response.data.date), // 문자열 날짜를 Date 객체로 변환
    };

    // 이미지가 있는 경우 별도로 업로드
    if (previewImage.value) {
      const formData = new FormData();
      formData.append("image", fileInput.value.files[0]);
      const imageResponse = await axios.post(`${API_URL}/image/${savedDiary.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      savedDiary.image = imageResponse.data.imageUrl;
    }

    // 일기 목록에 추가
    diaries.value.unshift(savedDiary);

    // 폼 초기화
    diaryTitle.value = "";
    diaryContent.value = "";
    selectedMood.value = "happy"; // 기본값으로 재설정
    selectedWeather.value = "sunny"; // 기본값으로 재설정
    previewImage.value = null;

    isWritingDiary.value = false; // 일기 작성 폼 숨기기
    hasDiaries.value = true; // 일기 작성 후 일기 목록이 있는 상태로 표시

    console.log("일기가 성공적으로 저장되었습니다:", savedDiary);
  } catch (error) {
    console.error("일기 저장 중 오류 발생:", error);
    alert("일기 저장 중 오류가 발생했습니다.");
  } finally {
    isSubmitting.value = false;
  }
};

// 일기 작성 취소
const cancelWritingDiary = () => {
  // 폼 초기화
  diaryTitle.value = "";
  diaryContent.value = "";
  selectedMood.value = "happy"; // 기본값으로 재설정
  selectedWeather.value = "sunny"; // 기본값으로 재설정
  previewImage.value = null;
  
  // 에러 초기화
  formErrors.mood = false;
  formErrors.weather = false;

  isWritingDiary.value = false; // 일기 작성 폼 숨기기
};

// 일기 작성 페이지로 이동
const goToWriteDiary = () => {
  currentView.value = "write";
  startWritingDiary();
};

// 날짜 포맷 함수
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

// 내용 줄임 함수
const truncateContent = (content) => {
  if (content.length > 100) {
    return content.substring(0, 100) + "...";
  }
  return content;
};

// 기분 이모지 가져오기
const getMoodEmoji = (moodValue) => {
  const mood = moods.find((m) => m.value === moodValue);
  return mood ? mood.emoji : "";
};

// 날씨 이모지 가져오기
const getWeatherEmoji = (weatherValue) => {
  const weather = weathers.find((w) => w.value === weatherValue);
  return weather ? weather.emoji : "";
};

// 일기 데이터를 가져오기
const fetchDiaries = async () => {
  try {
    const response = await axios.get(API_URL);
    diaries.value = response.data.map((diary) => ({
      ...diary,
      date: new Date(diary.date), // 문자열 날짜를 Date 객체로 변환
    }));
    hasDiaries.value = diaries.value.length > 0;
  } catch (error) {
    console.error("일기 데이터를 가져오는 중 오류 발생:", error);
    alert("일기 데이터를 가져오는 중 오류가 발생했습니다.");
  }
};

// 컴포넌트 마운트 시 일기 데이터를 가져옴
onMounted(() => {
  fetchDiaries();
  isWritingDiary.value = true; // 기본적으로 일기 작성 폼 표시
  
  // 기본값 설정
  selectedMood.value = "happy";
  selectedWeather.value = "sunny";
});

// 일기 수정 함수
const editDiary = (diary) => {
  // 수정할 일기 복사본 생성
  editingDiary.value = JSON.parse(JSON.stringify(diary));
  
  // 날짜 문자열 변환 (input type="date"용)
  const dateObj = new Date(diary.date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  editingDiary.value.dateString = `${year}-${month}-${day}`;
  
  // 기본값 설정 (값이 없는 경우)
  if (!editingDiary.value.mood) {
    editingDiary.value.mood = "happy";
  }
  
  if (!editingDiary.value.weather) {
    editingDiary.value.weather = "sunny";
  }

  // 수정 중인 일기의 인덱스 저장
  editingIndex.value = diaries.value.findIndex((d) => d.id === diary.id);

  // 수정 모달 표시
  isEditingDiary.value = true;
  
  // 에러 초기화
  editFormErrors.mood = false;
  editFormErrors.weather = false;
  editFormErrors.date = false;
};

// 수정용 파일 업로드 트리거
const triggerEditFileInput = () => {
  editFileInput.value.click();
};

// 수정용 파일 업로드 처리
const handleEditFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      editingDiary.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 수정용 이미지 제거
const removeEditImage = () => {
  editingDiary.value.image = null;
  if (editFileInput.value) {
    editFileInput.value.value = "";
  }
};

// 수정 취소
const cancelEdit = () => {
  isEditingDiary.value = false;
  editingDiary.value = {};
  editingIndex.value = -1;
  
  // 에러 초기화
  editFormErrors.mood = false;
  editFormErrors.weather = false;
  editFormErrors.date = false;
};

// 수정 저장
const saveEdit = async () => {
  // 폼 유효성 검사
  if (!validateEditForm()) {
    return;
  }
  
  // 제출 상태 시작
  isSubmitting.value = true;

  try {
    // 날짜 문자열을 Date 객체로 변환
    editingDiary.value.date = editingDiary.value.dateString;
    
    console.log("수정할 일기 데이터:", editingDiary.value); // 디버깅용 로그

    // axios를 사용하여 서버로 데이터 전송
    const response = await axios.put(
      `${API_URL}/${editingDiary.value.id}`,
      editingDiary.value
    );
    
    console.log("서버 응답:", response.data); // 디버깅용 로그

    // 서버에서 반환한 데이터로 일기 객체 업데이트
    const updatedDiary = {
      ...response.data,
      date: new Date(response.data.date), // 문자열 날짜를 Date 객체로 변환
    };

    // 수정된 일기 저장
    if (editingIndex.value !== -1) {
      diaries.value[editingIndex.value] = updatedDiary;
    }

    // 모달 닫기
    isEditingDiary.value = false;
    editingDiary.value = {};
    editingIndex.value = -1;

    console.log("일기가 성공적으로 수정되었습니다:", updatedDiary);
  } catch (error) {
    console.error("일기 수정 중 오류 발생:", error);
    alert("일기 수정 중 오류가 발생했습니다.");
  } finally {
    isSubmitting.value = false;
  }
};

// 삭제 확인 함수
const confirmDelete = (diary) => {
  diaryToDelete.value = diary;
  showDeleteConfirm.value = true;
};

// 삭제 취소
const cancelDelete = () => {
  showDeleteConfirm.value = false;
  diaryToDelete.value = null;
};

// 일기 삭제 함수
const deleteDiary = async () => {
  if (diaryToDelete.value) {
    isSubmitting.value = true;
    try {
      await axios.delete(`${API_URL}/${diaryToDelete.value.id}`);
      diaries.value = diaries.value.filter(
        (d) => d.id !== diaryToDelete.value.id
      );
      showDeleteConfirm.value = false;
      diaryToDelete.value = null;
    } catch (error) {
      console.error("일기 삭제 중 오류 발생:", error);
      alert("일기 삭제 중 오류가 발생했습니다.");
    } finally {
      isSubmitting.value = false;
    }
  }
};

// 컴포넌트 마운트 시 실행
onMounted(() => {
  // 필요한 초기화 작업
  isWritingDiary.value = true; // 기본적으로 일기 작성 폼 표시
  
  // 기본값 설정
  selectedMood.value = "happy";
  selectedWeather.value = "sunny";
});
</script>

<style scoped>
@font-face {
  font-family: "KOROAD_BOLD";
  src: url("src/assets/fonts/KOROAD_Bold.ttf");
}
@font-face {
  font-family: "KOROAD_LIGHT";
  src: url("src/assets/fonts/KOROAD_Light.ttf");
}
@font-face {
  font-family: "KOROAD_MEDIUM";
  src: url("src/assets/fonts/KOROAD_Medium.ttf");
}
.pet-diary {
  font-family: "KOROAD_LIGHT";
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  position: relative;
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  height: 50px;
}

.title {
  font-size: 1.2rem;
  color: #666;
  font-weight: normal;
  margin: 0;
  margin-right: auto;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.menu-text-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  transition: background-color 0.3s;
  margin-right: 80px;
}

.logout-text-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  transition: background-color 0.3s;
  margin-right: 10px;
}

.text-btn:hover {
  background-color: #f0f0f0;
}

.content-container {
  display: flex;
  flex: 1;
  width: 100%;
}

.sidebar {
  width: 250px;
  min-width: 250px;
  background-color: white;
  border-right: 1px solid #e0e0e0;
  height: calc(100vh - 50px);
  position: sticky;
  top: 50px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}

.pet-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #4a90e2;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.pet-image {
  width: 60%;
  height: auto;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.menu-item {
  padding: 1rem 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  transition: background-color 0.3s, color 0.3s;
}

.menu-item.active {
  color: #4a90e2;
  border-left: 3px solid #4a90e2;
  background-color: #f0f7ff;
}

.hover-effect:hover {
  background-color: #f0f0f0;
  color: #4a90e2;
  border-left: 3px solid #4a90e2;
}

.main-content {
  flex: 1;
  padding: 2rem;
  min-height: calc(100vh - 50px);
  overflow-y: auto;
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.empty-diary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 0;
  height: calc(100vh - 240px);
}

.empty-message {
  color: #666;
  margin-bottom: 2rem;
}

.write-diary-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.write-diary-btn:hover {
  background-color: #357ab7;
}

.pet-story {
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.story-title {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
  color: #333;
}

.story-subtitle {
  color: #999;
  font-size: 0.9rem;
}

/* 투명 메뉴바 스타일 */
.transparent-menu {
  position: absolute;
  top: 50px;
  right: 0;
  width: 200px;
  background-color: rgba(255, 255, 255, 0.9);
  border-left: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  z-index: 100;
  padding: 1rem;
}

.transparent-menu-title {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.transparent-menu-item {
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.transparent-menu-item:hover {
  background-color: #f0f0f0;
}

/* 일기 작성 폼 스타일 */
.diary-form-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.diary-form {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.form-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.form-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-title label {
  font-size: 1rem;
  color: #555;
  font-weight: 500;
}

.title-input {
  font-size: 1.2rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.title-input:focus {
  outline: none;
  border-color: #4a90e2;
}

.date-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.selected-date {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-label {
  font-size: 0.9rem;
  color: #777;
}

.date-value {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.calendar-toggle {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.calendar-toggle:hover {
  background-color: #f0f0f0;
}

/* 커스텀 달력 스타일 */
.custom-calendar {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 1rem;
  height: auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;
}

.calendar-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.calendar-nav-btn {
  background: none;
  border: none;
  font-size: 1rem;
  color: #555;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.calendar-nav-btn:hover {
  background-color: #e0e0e0;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.weekday {
  text-align: center;
  font-size: 0.9rem;
  color: #777;
  padding: 0.5rem;
}

.calendar-dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0.5rem;
  grid-auto-rows: 40px;
  grid-template-rows: none;
}

.calendar-date {
  text-align: center;
  padding: 0.75rem 0;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s;
}

.calendar-date:hover {
  background-color: #f0f0f0;
}

.calendar-date.other-month {
  color: #ccc;
}

.calendar-date.selected {
  background-color: #4a90e2;
  color: white;
}

.calendar-date.today {
  border: 2px solid #4a90e2;
}

/* 기분 및 날씨 선택 스타일 */
.mood-weather-section {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
}

.mood-selector,
.weather-selector {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mood-selector label,
.weather-selector label {
  font-size: 1rem;
  color: #555;
}

.required {
  color: #ff6b6b;
  margin-left: 2px;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.mood-options,
.weather-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.mood-option,
.weather-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s;
  width: calc(20% - 0.5rem);
  min-width: 70px;
}

.mood-option:hover,
.weather-option:hover {
  background-color: #f0f0f0;
}

.mood-option.selected,
.weather-option.selected {
  background-color: #e3f2fd;
  border: 1px solid #4a90e2;
}

.mood-emoji,
.weather-emoji {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.mood-label,
.weather-label {
  font-size: 0.8rem;
  color: #555;
}

/* 내용 입력 스타일 */
.content-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.content-section label {
  font-size: 1rem;
  color: #555;
}

.content-textarea {
  min-height: 250px;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
  transition: border-color 0.3s;
  width: 100%;
}

.content-textarea:focus {
  outline: none;
  border-color: #4a90e2;
}

/* 이미지 업로드 스타일 */
.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.image-upload-section label {
  font-size: 1rem;
  color: #555;
}

.image-upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-upload-area:hover {
  border-color: #4a90e2;
  background-color: #f7f9fc;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #777;
}

.upload-icon {
  font-size: 2rem;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
}

.remove-image-btn {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.3s;
}

.remove-image-btn:hover {
  background-color: #d32f2f;
}

/* 버튼 스타일 */
.diary-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.confirm-btn,
.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-btn {
  background-color: #4a90e2;
  color: white;
}

.confirm-btn:hover {
  background-color: #357ab7;
}

.confirm-btn:disabled {
  background-color: #a0c4e8;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #555;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

/* 일기 목록 스타일 */
.diary-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.diary-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.diary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.diary-card-header {
  padding: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.diary-info {
  flex: 1;
}

.diary-title {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.diary-date {
  font-size: 0.85rem;
  color: #888;
  margin: 0;
}

.diary-mood-weather {
  display: flex;
  gap: 0.5rem;
  font-size: 1.25rem;
}

.diary-card-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.diary-content {
  color: #555;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  flex: 1;
}

.diary-image-container {
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-radius: 8px;
  margin-top: auto;
}

.diary-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.diary-card-actions {
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn {
  background-color: #4a90e2;
  color: white;
}

.edit-btn:hover {
  background-color: #357ab7;
}

.delete-btn {
  background-color: #ff6b6b;
  color: white;
}

.delete-btn:hover {
  background-color: #e74c3c;
}

/* 수정 모달 스타일 */
.edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.edit-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.edit-modal-header {
  padding: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.edit-modal-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.edit-modal-footer {
  display: flex;
  justify-content: center; /* 버튼 중앙 정렬 */
  align-items: center;
  padding: 1rem;
  gap: 0.75rem; /* 버튼 간격 조정 */
  border-top: 1px solid #f0f0f0;
}

.save-btn,
.cancel-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn {
  background-color: #4a90e2;
  color: white;
}

.save-btn:hover {
  background-color: #357ab7;
}

.save-btn:disabled {
  background-color: #a0c4e8;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #ff6b6b;
  color: white;
}

.cancel-btn:hover {
  background-color: #e74c3c;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.95rem;
  color: #555;
}

.edit-input {
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.edit-input:focus {
  outline: none;
  border-color: #4a90e2;
}

.edit-textarea {
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: border-color 0.3s;
  font-family: inherit;
}

.edit-textarea:focus {
  outline: none;
  border-color: #4a90e2;
}

.mood-weather-edit {
  display: flex;
  gap: 1.5rem;
}

/* 삭제 확인 모달 스타일 */
.delete-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.delete-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.delete-modal-content {
  padding: 1.5rem;
  text-align: center;
}

.delete-modal-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #333;
}

.delete-modal-content p {
  margin: 0;
  color: #666;
}

.delete-modal-actions {
  display: flex;
  border-top: 1px solid #f0f0f0;
}

.delete-modal-actions button {
  flex: 1;
  padding: 1rem;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 8px; /* 버튼 테두리 둥글기 동일하게 설정 */
  margin: 10px; /* 버튼 간격 추가 */
}

/* 삭제 확인 모달의 취소 버튼 스타일 */
.delete-cancel-btn {
  background-color: #f0f0f0; /* 취소 버튼 색상 */
  color: #555;
}

.delete-cancel-btn:hover {
  background-color: #e0e0e0;
}

/* 삭제 확인 모달의 삭제 버튼 스타일 */
.delete-confirm-btn {
  background-color: #ff6b6b; /* 삭제 버튼 색상 */
  color: white;
}

.delete-confirm-btn:hover {
  background-color: #e74c3c;
}

.delete-confirm-btn:disabled {
  background-color: #ffb3b3;
  cursor: not-allowed;
}

/* 알림 메시지 스타일 */
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  z-index: 2000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out forwards;
}

.notification.success {
  background-color: #4caf50;
}

.notification.error {
  background-color: #f44336;
}

@keyframes slideIn {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .header {
    flex-wrap: wrap;
    height: auto;
    padding: 0.5rem;
  }

  .title {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .content-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    min-width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .main-content {
    width: 100%;
    padding: 1rem;
  }

  .diary-form {
    padding: 1rem;
  }

  .mood-weather-section {
    flex-direction: column;
    gap: 1rem;
  }

  .mood-option,
  .weather-option {
    width: calc(33.33% - 0.5rem);
  }

  .date-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .calendar-toggle {
    align-self: flex-end;
  }

  .diary-list {
    grid-template-columns: 1fr;
  }

  .mood-weather-edit {
    flex-direction: column;
    gap: 1rem;
  }

  .notification {
    left: 20px;
    right: 20px;
    text-align: center;
  }
}
</style>