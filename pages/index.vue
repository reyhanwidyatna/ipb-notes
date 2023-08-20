<template>
  <div class="board">
    <div class="board-title">
      Drop your Notes
    </div>
    <VueDraggable
      v-model="clientNotes"
      class="board-content"
      @start="drag=true"
      @end="drag=false"
      @change="handleNotesChange"
    >
      <div v-for="(note, index) in clientNotes" :key="index" class="note">
        <div class="note-close" @click="handleRemoveNote(index)">
          <img class="note-icon-close" src="~assets/icons/close.svg" />
        </div>
        <div class="note_cnt">
          <textarea
            ref="textarea"
            :value="note.description"
            class="cnt textarea-transition"
            placeholder="Tambahkan catatan anda"
            @input="event => {
              handleInput(event, index);
              handleUpdateDescription(index, event.target.value);
              adjustTextarea(index);
            }"
          ></textarea>
        </div>
      </div>
    </VueDraggable>
    <div class="board-button" @click="handleAddNote">
      <img class="note-icon-plus" src="~assets/icons/plus.svg" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: 'BoardPage',
  data() {
    return {
      drag: false,
      clientNotes: [],
      activeTextareaIndex: null,
    }
  },
  computed: {
    ...mapState('notes', {
      notes: state => state.notes
    })
  },
  mounted() {
    this.clientNotes = this.notes
  },
  methods: {
    ...mapMutations('notes', {
      addNote: 'ADD_NOTE',
      removeNote: 'REMOVE_NOTE',
      updateNotesOrder: 'SET_NOTES',
      updateNoteDescription: 'UPDATE_NOTE_DESCRIPTION',
    }),
    handleAddNote() {
      const newNote = {
        description: "",
        createdAt: new Date(),
      };
      this.addNote(newNote);
    },
    handleRemoveNote(index) {
      if (index >= 0 && index < this.notes.length) {
        this.removeNote(index);
      }
    },
    handleNotesChange() {
      this.updateNotesOrder(this.clientNotes);
    },
    handleUpdateDescription(index, description) {
      if (index >= 0 && index < this.notes.length) {
        this.updateNoteDescription({ index, description });
      }
    },
    adjustTextarea(index) {
      const textarea = this.$refs.textarea[index];
      const maxScrollHeight = 300;

      textarea.style.height = 'auto';
      textarea.style.overflowY = 'hidden';

      if (textarea.scrollHeight >= maxScrollHeight) {
        textarea.style.height = `${maxScrollHeight}px`;
      } else {
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    },
    handleInput(event, index) {
      const textarea = this.$refs.textarea[index];
      const maxScrollHeight = 300;

      if (textarea.scrollHeight > maxScrollHeight) {
        event.preventDefault();
        textarea.value = this.notes[index].description;
      } else {
        this.handleUpdateDescription(index, event.target.value);
        this.adjustTextarea(index);
      }
    },
    getIconPath(iconName) {
      return require(`@/assets/icons/${iconName}`);
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap');

body {
  margin: 0;
  font-family: 'Kalam', cursive;
}

.board {
  width: 100%;
  min-height: 100vh;
  height: 100%;
  padding: 24px 36px;
  box-sizing: border-box;
  position: relative;
}

.board-title {
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 64px;
}

.board-content {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 48px;
  vertical-align: middle;
}

.board-button {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(63, 167, 167);
  color: white;
  border-radius: 50%;
  font-size: 36px;
  font-weight: 700;
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 0 32px 48px 0;
}

.note {
  width: 260px;
  height: 300px;
  padding: 24px 16px;
  box-shadow: 5px 5px 10px -2px rgba(33, 33, 33, 0.3);
  transition: transform 0.15s;
  background-color: rgb(255, 242, 53);
  position: relative;
  z-index: 1;
  cursor: move;
}

.note-close {
  width: 24px;
  height: 24px;
  text-align: center;
  position: absolute;
  display: flex;
  right: 0;
  top: 0;
  margin-top: -10px;
  margin-right: -10px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  background-color: rgb(255, 255, 255);
  border: 0.8px solid rgb(199, 199, 199);
  font-weight: 700;
  border-radius: 50%;
}

.note textarea.cnt {
  width: 100%;
  height: 100%;
  min-height: 300px;
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

.note textarea.cnt:focus::placeholder {
  color: transparent;
}

.note textarea.textarea-transition {
  transition: height 0.2s;
}

.note textarea.cnt::-webkit-scrollbar {
  width: 0px;
}

.note textarea.cnt::-webkit-scrollbar-track {
  background-color: transparent;
}

.note textarea.cnt::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.note-icon-close {
  width: 14px;
  height: 14px;
}

.note-icon-plus {
  width: 36px;
  height: 36px;
  color: white;
}
</style>