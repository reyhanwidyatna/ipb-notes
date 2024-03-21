<template>
  <div class="survey">
    <div class="survey-navbar">
      <img src="~assets/png/museum-logo.png" />
      <div />
    </div>
    <div class="survey-header">
      <h1 class="survey-title">
        Mohon Penilaian Terhadap Layanan Kami
      </h1>
      <h3 class="survey-subtitle">
        Museum dan Gallery IPB
      </h3>
    </div>
    <div class="survey-content">
      <div class="survey-button" :class="{ active: activeButton === 1 }" @click="toggleActive(1)">
        <img class="survey-icon" src="/angry.png" />
        <p class="survey-button-title">
          Sangat Tidak Puas
        </p>
      </div>
      <div class="survey-button" :class="{ active: activeButton === 2 }" @click="toggleActive(2)">
        <img class="survey-icon" src="/pensive.png" />
        <p class="survey-button-title">
          Tidak Puas
        </p>
      </div>
      <div class="survey-button" :class="{ active: activeButton === 3 }" @click="toggleActive(3)">
        <img class="survey-icon" src="/happy.png" />
        <p class="survey-button-title">
          Puas
        </p>
      </div>
      <div class="survey-button" :class="{ active: activeButton === 4 }" @click="toggleActive(4)">
        <img class="survey-icon" src="/laughing.png" />
        <p class="survey-button-title">
          Sangat Puas
        </p>
      </div>
    </div>
    <div v-if="activeButton !== null" class="survey-send">
      <div class="survey-send-button" @click="submitFeedback">
        Kirim Survey
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      activeButton: null
    };
  },
  methods: {
    toggleActive(buttonIndex) {
      this.activeButton = buttonIndex === this.activeButton ? null : buttonIndex;
    },
    async submitFeedback() {
      if (!this.activeButton) return;

      const feedbackData = {
        satisfaction_level: this.activeButton,
        text: this.getFeedbackText(this.activeButton)
      };

      const res = await axios.post('https://api-museum.ipb.ac.id/api/surveys', feedbackData)
      if (res.data.status === 'success') {
        await this.$swal({
          icon: 'success',
          title: res.data.message,
          showConfirmButton: false,
          timer: 2500
        })
        this.activeButton = null;
        location.reload()
      } else {
        await this.$swal({
          icon: 'error',
          title: res.data.message,
          showConfirmButton: false,
          timer: 2500
        })
      }
    },
    getFeedbackText(satisfactionLevel) {
      switch (satisfactionLevel) {
        case 1:
          return 'Sangat Tidak Puas';
        case 2:
          return 'Tidak Puas';
        case 3:
          return 'Puas';
        case 4:
          return 'Sangat Puas';
        default:
          return '';
      }
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap');
body {
  margin: 0;
}

.survey {
  width: 100%;
  height: 100vh;
  background-color: #ebebeb;
}

.survey-navbar {
  display: flex;
  justify-content: space-around;
  color: #ffffff;
  font-size: 28px;
  font-family: 'Lato', sans-serif;
  padding: 16px;
}

.survey-header {
  margin: 64px 0;
}

.survey-title {
  font-family: 'Lato', sans-serif;
  text-align: center;
  color: #3A468F;
  font-size: 32px;
  font-weight: 900;
  margin: 0;
}

.survey-subtitle {
  font-family: 'Lato', sans-serif;
  text-align: center;
  color: #3A468F;
  font-size: 32px;
  font-weight: 900;
  margin: 0;
}

.survey-content {
  width: 100%;
  max-width: 1280px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 48px;
  margin: 0 auto;
}

.survey-button {
  width: 100%;
  padding: 48px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #f3f3f3;
  cursor: pointer;
}

.survey-button.active {
  background-color: white;
}

.survey-button-title {
  font-family: 'Lato', sans-serif;
  color: #3A468F;
  font-size: 24px;
  font-weight: 700;
}

.survey-icon {
  width: 148px;
  height: 148px;
}

.survey-send {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 64px;
}

.survey-send-button {
  width: fit-content;
  font-family: 'Lato', sans-serif;
  background-color: #3A468F;
  color: #ffffff;
  font-size: 18px;
  padding: 8px 16px;
  border-radius: 5px;
  font-weight: 700;
  cursor: pointer;
}

@media only screen and (max-width: 1440px) {
  .survey-content {
    width: 100%;
    max-width: 1080px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 36px;
    margin: 0 auto;
  }
}

@media only screen and (max-width: 1280px) {
  .survey-content {
    width: 100%;
    max-width: 800px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
    margin: 0 auto;
  }
}


@media only screen and (max-width: 768px) {
  .survey-content {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin: 0 auto;
  }
}
</style>