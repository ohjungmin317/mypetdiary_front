<template>
  <div class="register-page">
    <img src="../assets/image/logo.svg" alt="Logo" class="logo" />
    <div class="register">
      <form @submit.prevent="submitForm">
        <div>
        <label for="username">🐾 닉네임:</label>
        <input v-model="user.username" type="text" id="username" required />
      </div>
      <div>
        <label for="email">📧 이메일:</label>
        <input v-model="user.email" type="email" id="email" required />
      </div>
      <div>
        <label for="password">🔒 비밀번호:</label>
        <input v-model="user.password" type="password" id="password" required />
      </div>
      <button type="submit">회원가입</button>
    </form>

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
    async submitForm() {
      try {
        console.log(this.user);
        const response = await axios.post(
          "http://localhost:5173/api/auth/register",
          this.user
        );
        // // alert(response.data);
        //console.log(response.data);
        alert("회원가입이 성공적으로 완료되었습니다!");
        this.$router.push({ name: "login" });
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage =
            error.response.data.message || "Registration failed.";
        } else {
          this.errorMessage = "다시 입력하세요.";
        }
      }
    },
  },
};
</script>

<style scoped>
@font-face {
  font-family: "KOROAD_BOLD";
  src: url('src/assets/fonts/KOROAD_Bold.ttf');
}
@font-face {
  font-family: "KOROAD_LIGHT";
  src: url('src/assets/fonts/KOROAD_Light.ttf');
}
@font-face {
  font-family: "KOROAD_MEDIUM";
  src: url('src/assets/fonts/KOROAD_Medium.ttf');
}
/* ✅ 회원가입 페이지 배경 이미지 적용 */
.register-page {
  background: url('src/assets/image/dog_pattern.jpg') no-repeat center center fixed;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* ✅ 폼 스타일 (배경과 조화를 이루도록 디자인 변경) */
.register {
    background: rgba(255, 255, 255, 0.8); /* 투명한 흰색 배경 */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 350px;
    height: auto;
    margin-top: -180px;
    font-family: 'KOROAD_LIGHT';
    font-size: 18px; /* 폰트 사이즈 키우기 */
  }

  .register form div {
    text-align: left; /* 텍스트 왼쪽 정렬 */
    margin-bottom: 15px;
  }

  .register label {
    display: block;
    margin-bottom: 5px;
  }

  .register input {
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

  .register input:focus {
    border-bottom-color: #ABB868; 
  }

  .register button {
    width: 100%;
    padding: 10px;
    background-color: #ABB868;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 18px;
    border-radius: 5px;
  }

  .register button:hover {
    background-color: #45a049;
  }
.logo {
  width: 600px;
  margin-bottom: 20px;
  margin-top:-100px;
}

/* 오류 메시지 스타일 */
.error {
  color: red;
  margin-top: 10px;
  font-family: 'KOROAD_BOLD';
}
</style>
