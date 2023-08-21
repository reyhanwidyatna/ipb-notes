<template>
  <div class="textarea">
    <textarea
      ref="textarea"
      v-model="note"
      class="input textarea-transition"
      placeholder="Tambahkan catatan"
      @input="handleInput"
      @paste="handlePaste"
    ></textarea>
    <div class="textarea-action">
      <div class="textarea-color">
        <div
          v-for="color in colors"
          :key="color"
          class="canvas-color-preview"
          :style="{ backgroundColor: color }"
          @click="setDrawingColor(color)"
        ></div>
      </div>
      <div>
        <button class="textarea-reset" @click="resetInput">
          Reset
        </button>
        <button class="textarea-save" @click="saveInput">
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'VueTextarea',
  data() {
    return {
      note: '',
      maxScrollHeight: 320,
      currentColor: '#ffff88',
      colors: [
        '#ffff88',
        '#ff32b2',
        '#a9edf1',
        '#74ed4b',
      ]
    }
  },
  methods: {
    handleInput() {
      const textarea = this.$refs.textarea;
      if (textarea.scrollHeight > this.maxScrollHeight) {
        this.note = this.note.slice(0, this.note.length - 1)
      }
    },
    handlePaste(event) {
      event.preventDefault();
    },
    setDrawingColor(color) {
      this.currentColor = color
      this.$emit('color', color);
    },
    resetInput() {
      this.note = ''
    },
    saveInput() {
      if (this.note) {
        this.$emit('create', { note: this.note, color: this.currentColor })
      } else {
        this.$toasted.show('Pesan Anda masih kosong!!!', {
          position: 'top-center',
          duration: 1500,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
.textarea textarea.input {
  width: 100%;
  height: 320px;
  padding: 16px;
  box-sizing: border-box;
  resize: none;
  outline: none;
  border: none;
  transition: font-size 0.2s;
  background-color: transparent;
  scrollbar-width: none;
  font-size: 20px;
  font-family: 'Kalam', cursive;
  font-weight: 600;
}

.textarea textarea.input:focus::placeholder {
  color: transparent;
}

.textarea textarea.textarea-transition {
  transition: height 0.2s;
}

.textarea textarea.input::-webkit-scrollbar {
  width: 0px;
}

.textarea textarea.input::-webkit-scrollbar-track {
  background-color: transparent;
}

.textarea textarea.input::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.textarea-action {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  padding: 8px 16px;
  box-sizing: border-box;
}

.textarea-color {
  display: flex;
  gap: 4px;
  cursor: pointer;
}

.textarea-color-preview {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgb(75, 75, 75);
}
.textarea-reset {
  padding: 6px 12px;
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  margin-right: 4px;
  background-color: red;
}

.textarea-save {
  padding: 6px 12px;
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  background-color: green;
}
</style>