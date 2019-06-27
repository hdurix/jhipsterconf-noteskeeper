import { Component, Vue, Inject } from 'vue-property-decorator';

import { numeric, required, minLength, maxLength } from 'vuelidate/lib/validators';

import AlertService from '@/shared/alert/alert.service';
import { INote, Note } from '@/shared/model/note.model';
import NoteService from './note.service';

const validations: any = {
  note: {
    label: {},
    description: {},
    dueDate: {}
  }
};

@Component({
  validations
})
export default class NoteUpdate extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('noteService') private noteService: () => NoteService;
  public note: INote = new Note();
  public isSaving = false;

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.noteId) {
        vm.retrieveNote(to.params.noteId);
      }
    });
  }

  public save(): void {
    this.isSaving = true;
    if (this.note.id) {
      this.noteService()
        .update(this.note)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = 'A Note is updated with identifier ' + param.id;
          this.alertService().showAlert(message, 'info');
        });
    } else {
      this.noteService()
        .create(this.note)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = 'A Note is created with identifier ' + param.id;
          this.alertService().showAlert(message, 'success');
        });
    }
  }

  public retrieveNote(noteId): void {
    this.noteService()
      .find(noteId)
      .then(res => {
        this.note = res;
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {}
}
