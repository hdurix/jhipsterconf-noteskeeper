/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';

import * as config from '@/shared/config/config';
import NoteDetailComponent from '@/entities/note/note-details.vue';
import NoteClass from '@/entities/note/note-details.component';
import NoteService from '@/entities/note/note.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('Note Management Detail Component', () => {
    let wrapper: Wrapper<NoteClass>;
    let comp: NoteClass;
    let noteServiceStub: SinonStubbedInstance<NoteService>;

    beforeEach(() => {
      noteServiceStub = sinon.createStubInstance<NoteService>(NoteService);

      wrapper = shallowMount<NoteClass>(NoteDetailComponent, { store, localVue, provide: { noteService: () => noteServiceStub } });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundNote = { id: 123 };
        noteServiceStub.find.resolves(foundNote);

        // WHEN
        comp.retrieveNote(123);
        await comp.$nextTick();

        // THEN
        expect(comp.note).toBe(foundNote);
      });
    });
  });
});
