<template>
  <div class="survey">
    <div class="survey-header">
      <div class="survey-navbar">
        <img src="~assets/png/museum-logo.png" />
      </div>
      <h1 class="survey-title">
        Mohon Penilaian Terhadap Layanan Kami
      </h1>
      <h3 class="survey-subtitle">
        Museum dan Gallery IPB
      </h3>
    </div>
    <div class="survey-content">
      <div class="survey-button" @click="submitFeedback(1)">
        <img class="survey-icon" src="~assets/png/angry.png" />
        <p class="survey-button-title">
          Sangat Tidak Puas
        </p>
      </div>
      <div class="survey-button" @click="submitFeedback(2)">
        <img class="survey-icon" src="~assets/png/pensive.png" />
        <p class="survey-button-title">
          Tidak Puas
        </p>
      </div>
      <div class="survey-button" @click="submitFeedback(3)">
        <img class="survey-icon" src="~assets/png/happy.png" />
        <p class="survey-button-title">
          Puas
        </p>
      </div>
      <div class="survey-button" @click="submitFeedback(4)">
        <img class="survey-icon" src="~assets/png/laughing.png" />
        <p class="survey-button-title">
          Sangat Puas
        </p>
      </div>
    </div>
    <div class="survey-datetime">
      <div class="survey-datetime-text">
        <p class="survey-datetime-time">
          {{ currentTime }}
        </p>
        <p class="survey-datetime-date">
          {{ currentDate }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      currentTime: this.getCurrentTime(),
      currentDate: this.getCurrentDate()
    };
  },
  mounted() {
    setInterval(() => {
      this.currentTime = this.getCurrentTime();
      this.currentDate = this.getCurrentDate();
    }, 1000);
  },
  methods: {
    getCurrentTime() {
      const now = new Date();
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };

      const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
      return `${formattedTime}`;
    },
    getCurrentDate() {
      const now = new Date();
      const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };

      const formattedDate = now.toLocaleDateString('id-ID', dateOptions);
      return `${formattedDate}`;
    },
    async submitFeedback(data) {
      const feedbackData = {
        satisfaction_level: data,
        text: this.getFeedbackText(data)
      };

      const res = await axios.post('https://api-museum.ipb.ac.id/api/surveys', feedbackData)
      if (res.data.status === 'success') {
        await this.$swal({
          icon: 'success',
          title: 'Terima Kasih Atas Partisipasi Anda',
          showConfirmButton: false,
          timer: 2000
        })
      } else {
        await this.$swal({
          icon: 'error',
          title: res.data.message,
          showConfirmButton: false,
          timer: 2000
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

.swal2-popup {
  font-size: 1.4rem !important;
  font-family: 'Lato', sans-serif;
}

.survey {
  width: 100%;
  height: 100vh;
  background-color: #ebebeb;
}

.survey-navbar {
  max-width: 1080px;
  margin: 0 auto;
  color: #ffffff;
  font-size: 28px;
  font-family: 'Lato', sans-serif;
  padding: 16px 0;
}

.survey-header {
  max-width: fit-content;
  margin: 0 auto 72px auto;
}

.survey-title {
  font-family: 'Lato', sans-serif;
  text-align: center;
  color: #3A468F;
  font-size: 32px;
  font-weight: 900;
  margin: 64px 0 0 0;
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

.survey-datetime {
  display: flex;
  justify-content: center;
  align-items: center;
}

.survey-datetime-text {
  margin-top: 48px;
  padding: 24px 48px;
  border-radius: 80px;
  background-color: #f3f3f3;
}

.survey-datetime-time {
  font-family: 'Lato', sans-serif;
  color: #3A468F;
  font-size: 40px;
  font-weight: 900;
  margin: 0;
}

.survey-datetime-date {
  font-family: 'Lato', sans-serif;
  color: #3A468F;
  font-size: 20px;
  text-align: center;
  font-weight: 700;
  margin: 0;
  margin-top: 8px;
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