<template>
  <div class="board">
    <div class="board-wall">
      <div class="board-option">
        <h3 class="board-title">
          Catatan Pengunjung
        </h3>
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
          :style="{ backgroundColor: note.color || '#ffff88' }"
          class="note handle"
        >
          <div
            class="note-close"
            @click="handleRemoveNote(index)"
            @touchstart="handleRemoveNote(index)"
          >
            <img class="note-icon-close" src="~assets/icons/close.svg" />
          </div>
          <div class="note-header" />
          <div class="note-content">
            <div v-if="note.type === 'text'" style="display: flex;">
              <div class="note-text">
                {{ note.description  }}
              </div>
            </div>
            <div v-else style="display: flex;">
              <img class="note-drawing" :src="note.url" alt="note" loading="lazy" />
            </div>
          </div>
        </div>
      </VueDraggable>
    </div>

    <div class="board-button" @click="handleAddNote">
      <img class="note-icon-plus" src="~assets/icons/plus.svg" />
    </div>

    <modal
      name="vue-choose-note"
      height="auto"
      :width="300"
      :adaptive="true"
      :click-to-close="false"
    >
      <div class="modal-choose">
        <div class="modal-choose-header">
          <div class="modal-choose-close" @click="closeChooseModal">
            <img class="modal-choose-icon-close" src="~assets/icons/close.svg" />
          </div>
        </div>
        <div class="modal-choose-content">
          <p class="modal-choose-title">Jenis Catatan</p>
          <div v-for="(option, index) in options" :key="index" class="modal-choose-option">
            <input
              :id="option.value"
              v-model="selectedOption"
              type="radio"
              :value="option.value"
            >
            <label :for="option.value">{{ option.name }}</label>
          </div>
          <button class="modal-choose-button" @click="chooseOption">
            PILIH
          </button>
        </div>
      </div>
    </modal>

    <modal
      name="vue-create-note"
      height="auto"
      :width="300"
      :adaptive="true"
      :click-to-close="false"
    >
      <div class="modal">
        <div class="modal-header">
          <div class="modal-close" @click="closeNoteModal">
            <img class="modal-icon-close" src="~assets/icons/close.svg" />
          </div>
        </div>
        <div class="modal-content" :style="{ backgroundColor: colorBase }">
          <VueDrawing
            v-if="selectedOption === 'draw'"
            @create="saveNoteFromDrawing"
            @color="setColorBase"
          />
          <VueTextarea
            v-else
            @create="saveNoteFromText"
            @color="setColorBase"
          />
        </div>
      </div>
    </modal>

    <modal
      name="vue-delete-note"
      height="auto"
      :width="300"
      :adaptive="true"
      :click-to-close="false"
    >
      <div class="modal-delete">
        <div class="modal-delete-header">
          <div class="modal-delete-close" @click="closeDeleteModal">
            <img class="modal-delete-icon-close" src="~assets/icons/close.svg" />
          </div>
        </div>
        <div class="modal-delete-content">
          <h3 class="modal-delete-title">Masukkan Password</h3>
          <img
            class="modal-delete-illustration"
            src="~assets/png/private-campaign.png"
            alt="illustration"
          />
          <input
            v-model="privateToken"
            class="modal-delete-input"
            type="password"
            placeholder="*******"
          />
          <button
            class="modal-delete-button"
            :disabled="!isFieldComplete"
            @click="submitRemoveNote"
          >
            KIRIM
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import debounce from "lodash/debounce";
import VueDrawing from "../components/VueDrawing";
import VueTextarea from "../components/VueTextarea";

export default {
  name: 'BoardPage',
  components: {
    VueDrawing,
    VueTextarea
  },
  data() {
    return {
      drag: false,
      clientNotes: [],
      typeNote: 'text',
      colorBase: '#ffff88',
      privateToken: '',
      accessToken: 'ipbnotes1963',
      deletedIndex: -1,
      options: [
        { name: 'Teks', value: 'text' },
        { name: 'Gambar', value: 'draw' },
      ],
      selectedOption: 'text'
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
        chosenClass: 'chosen',
	      dragClass: 'drag',
        filter: 'textarea',
        preventOnFilter: false,
      };
    },
    isFieldComplete() {
      return this.privateToken.length > 0
    }
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
    setColorBase(color) {
      this.colorBase = color
    },
    handleAddNote() {
      this.showChooseModal()
    },
    showChooseModal () {
      document.body.classList.add('overflow-hidden');
      this.$modal.show('vue-choose-note');
    },
    closeChooseModal () {
      document.body.classList.remove('overflow-hidden');
      this.$modal.hide('vue-choose-note');
    },
    chooseOption() {
      this.closeChooseModal()
      this.showNoteModal()
    },
    showNoteModal () {
      document.body.classList.add('overflow-hidden');
      this.colorBase = '#ffff88';
      this.$modal.show('vue-create-note');
    },
    closeNoteModal () {
      document.body.classList.remove('overflow-hidden');
      this.colorBase = '#ffff88';
      this.$modal.hide('vue-create-note');
    },
    showDeleteModal () {
      document.body.classList.add('overflow-hidden');
      this.$modal.show('vue-delete-note');
    },
    closeDeleteModal () {
      document.body.classList.remove('overflow-hidden');
      this.deletedIndex = -1;
      this.$modal.hide('vue-delete-note');
    },
    saveNoteFromDrawing(note) {
      const newNote = {
        url: note.url,
        color: note.color,
        type: 'draw',
        createdAt: new Date()
      };
      this.addNote(newNote);
      this.closeNoteModal();
    },
    saveNoteFromText(note) {
      const newNote = {
        description: note.note,
        color: note.color,
        createdAt: new Date(),
        type: 'text',
      };
      this.addNote(newNote);
      this.closeNoteModal();
    },
    handleRemoveNote: debounce(function (index) {
      if (index >= 0 && index < this.notes.length) {
        this.deletedIndex = index;
        this.showDeleteModal();
      }
    }, 200, {
      leading: true,
      trailing: false,
    }),
    submitRemoveNote() {
      if (this.privateToken === this.accessToken) {
        this.removeNote(this.deletedIndex);
        this.privateToken = '';
        this.closeDeleteModal();
      } else {
        this.$toasted.show('Password Salah', {
          position: 'top-center',
          duration: 1500,
          type: 'error'
        })
      }
    },
    handleNotesChange() {
      this.updateNotesOrder(this.clientNotes);
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;

      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Roboto:wght@400;500;700&display=swap');
body {
  margin: 0;
  font-family: 'Kalam', cursive;
}

.overflow-hidden {
  overflow: hidden;
}

.board {
  width: 100%;
  min-height: 100vh;
  height: 100%;
  position: relative;
  box-sizing: border-box;
}

.board-wall {
  width: 100%;
  height: 100%;
  padding: 32px 64px;
  box-sizing: border-box;
  background-image:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)),
    url('~assets/jpg/museum-background.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.board-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.board-option {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin:48px 0;
  gap: 8px;
}

.board-option-button {
  padding: 8px 24px;
  border: none;
  font-weight: 500;
  border-radius: 3px;
  cursor: pointer;
  border: 1px solid #929292;
  font-family: 'Roboto', sans-serif;
}

.board-option-button--active {
  padding: 8px 24px;
  border: 1px solid #025f9a;
  background-color: #025f9a;
  color: white;
  font-weight: 500;
  border-radius: 3px;
  cursor: pointer;
}

.board-content {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 36px;
  vertical-align: middle;
  justify-items: center;
}

.board-button {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #025f9a;
  box-shadow: 5px 5px 10px -2px rgba(33, 33, 33, 0.3);
  color: white;
  border-radius: 50%;
  font-size: 36px;
  font-weight: 700;
  position: fixed;
  right: 48px;
  bottom: 48px;
  z-index: 99;
  cursor: pointer;
}

.ghost {
  opacity: 0.75;
  background: #c8ebfb;
}

.note {
  width: 300px;
  height: 370px;
  box-shadow: 5px 5px 10px -2px rgba(33, 33, 33, 0.3);
  transition: transform 0.15s;
  position: relative;
  cursor: move;
  z-index: 1;
}

.note-header {
  height: 40px;
  width: 100%;
  background-color: #025f9a;
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

.note-drawing {
  width: 100%;
  height: 100%;
}

.note-text {
  width: 100%;
  height: 100%;
  font-size: 20px;
  font-weight: 600;
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


.modal-choose {
  width: 100%;
  height: 100%;
  font-family: 'Roboto', sans-serif;
}

.modal-choose-header {
  height: 40px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.modal-choose-close {
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  background-color: rgb(255, 255, 255);
  border: 0.8px solid rgb(199, 199, 199);
  font-weight: 700;
  border-radius: 50%;
}

.modal-choose-icon-close {
  width: 14px;
  height: 14px;
}

.modal-choose-content {
  padding: 0 24px 24px 24px;
}

.modal-choose-title {
  text-align: center;
  margin-bottom: 32px;
  font-size: 20px;
  margin-top: 0;
}

.modal-choose-option {
  width: fit-content;
  margin-bottom: 8px;
  font-size: 18px;
  cursor: pointer;
}
.modal-choose-button {
  width: 100%;
  height: 100%;
  margin-top: 24px;
  background-color: #025f9a;
  padding: 12px 0;
  border: none;
  border-radius: 3px;
  color: white;
}

.modal {
  width: 100%;
  height: 100%;
}

.modal-header {
  height: 40px;
  width: 100%;
  background-color: #025f9a;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.modal-close {
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  background-color: rgb(255, 255, 255);
  border: 0.8px solid rgb(199, 199, 199);
  font-weight: 700;
  border-radius: 50%;
}

.modal-icon-close {
  width: 14px;
  height: 14px;
}

.modal-content {
  width: 100%;
  background-color: rgb(255, 242, 53);
}

.modal-delete {
  width: 100%;
  height: 100%;
}

.modal-delete-header {
  height: 40px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.modal-delete-close {
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  background-color: rgb(255, 255, 255);
  font-weight: 700;
  border-radius: 50%;
}

.modal-delete-icon-close {
  width: 16px;
  height: 16px;
}

.modal-delete-content {
  padding: 0 24px 16px 24px;
}

.modal-delete-title {
  text-align: center;
  font-family: 'Roboto', sans-serif;
  margin-top: 0;
  margin-bottom: 16px;
}

.modal-delete-illustration {
  width: 128px;
  height: 128px;
  margin: auto;
  display: flex;
}

.modal-delete-input {
  width: 100%;
  height: 36px;
  margin-top: 16px;
  box-sizing: border-box;
  padding: 4px 8px  ;
} 

.modal-delete-button {
  width: 100%;
  height: 36px;
  margin: 16px 0;
  box-sizing: border-box;
  background-color: #025f9a;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 3px;
  font-family: 'Roboto', sans-serif;
}

@media only screen and (max-width: 1440px) {
  .board-content {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
}

@media only screen and (max-width: 1280px) {
  .board-content {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

@media only screen and (max-width: 768px) {
  .board {
    padding: 24px 24px 64px 24px;
  }

  .board-banner {
    display: none;
  }

  .board-title {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 24px;
  }

  .board-wall {
    width: 100%;
    height: 100%;
    padding: 0;
    box-sizing: border-box;
  }
  
  .board-option {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 36px 0;
    gap: 8px;
  }

  .board-content {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }

  .board-button {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 99;
  }

  .note {
    height: 380px;
  }
}
</style>