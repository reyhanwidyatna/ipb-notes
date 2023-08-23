export const state = () => ({
  notes: []
})

export const mutations = {
  ADD_NOTE(state, note) {
    state.notes.push(note);
  },
  REMOVE_NOTE(state, index) {
    state.notes.splice(index, 1);
  },
  SET_NOTES(state, newNotes) {
    state.notes = newNotes;
  },
  UPDATE_NOTE_DESCRIPTION(state, { index, description }) {
    state.notes[index].description = description;
  }
}