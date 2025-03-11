<template>
  <div class="login-page">
    <img src="../assets/image/logo.svg" alt="Logo" class="logo" />
    <div class="login">
      <form @submit.prevent="submitForm">
        <div>
          <label for="email">📧 이메일:</label>
          <input v-model="user.email" type="email" id="email" required />
        </div>
        <div>
          <label for="password">🔒 비밀번호:</label>
          <input
            v-model="user.password"
            type="password"
            id="password"
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      <button type="button" class="register" @click="goToRegister">
        회원가입
      </button>

      <div v-if="errorMessage" class="error">
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    goToRegister() {
      this.$router.push({ name: "register" });
    },
    async submitForm() {
      try {
        const response = await axios.post(
          "http://localhost:5173/api/auth/login",
          {
            email: this.user.email,
            password: this.user.password,
          }
        );
        if (response.data === "Login successful") {
          this.$router.push({ name: "creatediary" });
        } else {
          this.errorMessage = "이메일 또는 비밀번호가 잘못되었습니다.";
        }
      } catch (error) {
        this.errorMessage = "로그인 실패. 다시 시도해주세요.";
      }
    },
  },
};
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
/* ✅ 회원가입 페이지 배경 이미지 적용 */
.login-page {
  background: url("src/assets/image/dog_pattern.jpg") no-repeat center center
    fixed;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* ✅ 폼 스타일 (배경과 조화를 이루도록 디자인 변경) */
.login {
  background: rgba(255, 255, 255, 0.8); /* 투명한 흰색 배경 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 350px;
  height: auto;
  margin-top: -180px;
  font-family: "KOROAD_LIGHT";
  font-size: 18px; /* 폰트 사이즈 키우기 */
}

.login form div {
  text-align: left; /* 텍스트 왼쪽 정렬 */
  margin-bottom: 15px;
}

.login label {
  display: block;
  margin-bottom: 5px;
}

.login input {
  background: rgba(255, 255, 255, 0);
  width: calc(100% - 20px);
  padding: 10px 0;
  border: none;
  border-bottom: 2px solid #000;
  outline: none;
  font-size: 16px;
  margin-left: 10px;
  margin-right: 10px;
}

.login input:focus {
  border-bottom-color: #abb868;
}

.login button {
  width: 100%;
  padding: 10px;
  background-color: #abb868;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  border-radius: 5px;
}

.login button:hover {
  background-color: #2caf70;
}

.logo {
  width: 600px;
  margin-bottom: 20px;
  margin-top: -100px;
}

.register {
  width: 100%;
  padding: 10px;
  background-color: #abb868;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  border-radius: 5px;
  margin-top: 10px;
}

/* 오류 메시지 스타일 */
.error {
  color: red;
  margin-top: 10px;
  font-family: "KOROAD_BOLD";
}
</style>
