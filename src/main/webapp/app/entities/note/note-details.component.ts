import { Component, Vue, Inject } from 'vue-property-decorator';

import { INote } from '@/shared/model/note.model';
import NoteService from './note.service';

@Component
export default class NoteDetails extends Vue {
  @Inject('noteService') private noteService: () => NoteService;
  public note: INote = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.noteId) {
        vm.retrieveNote(to.params.noteId);
      }
    });
  }

  public retrieveNote(noteId) {
    this.noteService()
      .find(noteId)
      .then(res => {
        this.note = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
