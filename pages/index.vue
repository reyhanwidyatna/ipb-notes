<template>
  <div class="board">
    <div class="board-title">
      Drop your Notes
    </div>
    <VueDraggable
      v-model="clientNotes"
      v-bind="dragOptions"
      class="board-content"
      handle=".handle"
      :move="onMove"
      @start="drag=true"
      @end="drag=false"
      @change="handleNotesChange"
    >
      <div
        v-for="(note, index) in clientNotes"
        :key="index"
        class="note handle"
      >
        <div
          class="note-close"
          @click="handleRemoveNote(index)"
          @touchstart="handleRemoveNote(index)"
        >
          <img class="note-icon-close" src="~assets/icons/close.svg" />
        </div>
        <div class="note-header handle"></div>
        <div class="note-content">
          <textarea
            ref="textarea"
            class="input textarea-transition"
            placeholder="Tambahkan catatan anda"
            :value="note.description"
            @focusout="handleFocusOut"
            @input="event => {
              handleInput(event, index);
              handleUpdateDescription(index, event.target.value);
              adjustTextarea(index);
            }"
          ></textarea>
          <div
            v-if="!isTextArea"
            class="textarea-cover handle"
            @click="handleFocusIn"
            @touchstart="handleFocusIn"
          ></div>
      </div>
      </div>
    </VueDraggable>
    <div
      class="board-button"
      @click="handleAddNote"
    >
      <img class="note-icon-plus" src="~assets/icons/plus.svg" />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { mapState, mapMutations } from "vuex";

export default {
  name: 'BoardPage',
  data() {
    return {
      drag: false,
      clientNotes: [],
      activeTextareaIndex: null,
      isTextArea: true,
    }
  },
  computed: {
    ...mapState('notes', {
      notes: state => state.notes
    }),  
    dragOptions() {
      return {
        animation: 0,
        easing: 'cubic-bezier(1, 0, 0, 1)',
        ghostClass: 'ghost',
        filter: 'textarea',
        preventOnFilter: false,
      };
    },
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
    handleRemoveNote: debounce(function (index) {
      if (index >= 0 && index < this.notes.length) {
        this.removeNote(index);
      }
    }, 200, {
      leading: true,
      trailing: false,
    }),
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
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;

      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },
    handleFocusOut() {
      this.isTextArea = false
    },
    handleFocusIn() {
      this.isTextArea = true
    }
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
  align-items: center;
  gap: 48px;
  vertical-align: middle;
}

.board-button {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(108, 155, 255);
  box-shadow: 5px 5px 10px -2px rgba(33, 33, 33, 0.3);
  color: white;
  border-radius: 50%;
  font-size: 36px;
  font-weight: 700;
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 0 24px 24px 0;
  z-index: 99;
}

.ghost {
  opacity: 0.75;
  background: #c8ebfb;
}

.note {
  width: 260px;
  height: 380px;
  box-shadow: 5px 5px 10px -2px rgba(33, 33, 33, 0.3);
  transition: transform 0.15s;
  background-color: rgb(255, 242, 53);
  position: relative;
  z-index: 1;
  cursor: move;
}

.note-header {
  height: 40px;
  width: 100%;
  background-color: #06125c;
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

.note-content {
  padding: 16px;
  position: relative;
}

.note textarea.input {
  width: 100%;
  height: 300px;
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

.note textarea.input:focus::placeholder {
  color: transparent;
}

.note textarea.textarea-transition {
  transition: height 0.2s;
}

.note textarea.input::-webkit-scrollbar {
  width: 0px;
}

.note textarea.input::-webkit-scrollbar-track {
  background-color: transparent;
}

.note textarea.input::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.textarea-cover {
  height: 300px;
  width: 100%;
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
}

.note-icon-close {
  width: 14px;
  height: 14px;
}

.note-icon-plus {
  width: 32px;
  height: 32px;
  color: white;
}

@media only screen and (max-width: 768px) {
  .board {
    padding: 24px 24px 64px 24px;
  }

  .board-title {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 48px;
  }

  .board-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 48px;
  }

  .note {
    height: 380px;
  }
}
</style>