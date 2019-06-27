import { Component, Inject, Vue } from 'vue-property-decorator';
import { INote } from '@/shared/model/note.model';
import AlertService from '@/shared/alert/alert.service';

import NoteService from './note.service';

@Component
export default class Note extends Vue {
  @Inject('alertService') private alertService: () => AlertService;
  @Inject('noteService') private noteService: () => NoteService;
  private removeId: number = null;
  public notes: INote[] = [];

  public isFetching = false;
  public dismissCountDown: number = this.$store.getters.dismissCountDown;
  public dismissSecs: number = this.$store.getters.dismissSecs;
  public alertType: string = this.$store.getters.alertType;
  public alertMessage: any = this.$store.getters.alertMessage;

  public getAlertFromStore() {
    this.dismissCountDown = this.$store.getters.dismissCountDown;
    this.dismissSecs = this.$store.getters.dismissSecs;
    this.alertType = this.$store.getters.alertType;
    this.alertMessage = this.$store.getters.alertMessage;
  }

  public countDownChanged(dismissCountDown: number) {
    this.alertService().countDownChanged(dismissCountDown);
    this.getAlertFromStore();
  }

  public mounted(): void {
    this.retrieveAllNotes();
  }

  public clear(): void {
    this.retrieveAllNotes();
  }

  public retrieveAllNotes(): void {
    this.isFetching = true;

    this.noteService()
      .retrieve()
      .then(
        res => {
          this.notes = res.data;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
        }
      );
  }

  public prepareRemove(instance: INote): void {
    this.removeId = instance.id;
  }

  public removeNote(): void {
    this.noteService()
      .delete(this.removeId)
      .then(() => {
        const message = 'A Note is deleted with identifier ' + this.removeId;
        this.alertService().showAlert(message, 'danger');
        this.getAlertFromStore();

        this.removeId = null;
        this.retrieveAllNotes();
        this.closeDialog();
      });
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }
}
