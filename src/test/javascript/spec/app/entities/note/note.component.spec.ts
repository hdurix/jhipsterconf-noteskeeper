/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import AlertService from '@/shared/alert/alert.service';
import * as config from '@/shared/config/config';
import NoteComponent from '@/entities/note/note.vue';
import NoteClass from '@/entities/note/note.component';
import NoteService from '@/entities/note/note.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('b-alert', {});
localVue.component('b-badge', {});
localVue.directive('b-modal', {});
localVue.component('b-button', {});
localVue.component('router-link', {});

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {}
  }
};

describe('Component Tests', () => {
  describe('Note Management Component', () => {
    let wrapper: Wrapper<NoteClass>;
    let comp: NoteClass;
    let noteServiceStub: SinonStubbedInstance<NoteService>;

    beforeEach(() => {
      noteServiceStub = sinon.createStubInstance<NoteService>(NoteService);
      noteServiceStub.retrieve.resolves({ headers: {} });

      wrapper = shallowMount<NoteClass>(NoteComponent, {
        store,
        localVue,
        stubs: { bModal: bModalStub as any },
        provide: {
          alertService: () => new AlertService(store),
          noteService: () => noteServiceStub
        }
      });
      comp = wrapper.vm;
    });

    it('should be a Vue instance', () => {
      expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it('Should call load all on init', async () => {
      // GIVEN
      noteServiceStub.retrieve.resolves({ headers: {}, data: [{ id: 123 }] });

      // WHEN
      comp.retrieveAllNotes();
      await comp.$nextTick();

      // THEN
      expect(noteServiceStub.retrieve.called).toBeTruthy();
      expect(comp.notes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('Should call delete service on confirmDelete', async () => {
      // GIVEN
      noteServiceStub.delete.resolves({});

      // WHEN
      comp.prepareRemove({ id: 123 });
      comp.removeNote();
      await comp.$nextTick();

      // THEN
      expect(noteServiceStub.delete.called).toBeTruthy();
      expect(noteServiceStub.retrieve.callCount).toEqual(2);
    });
  });
});
