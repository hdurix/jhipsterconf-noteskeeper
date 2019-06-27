/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';

import AlertService from '@/shared/alert/alert.service';
import * as config from '@/shared/config/config';
import NoteUpdateComponent from '@/entities/note/note-update.vue';
import NoteClass from '@/entities/note/note-update.component';
import NoteService from '@/entities/note/note.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const store = config.initVueXStore(localVue);
const router = new Router();
localVue.use(Router);
localVue.component('font-awesome-icon', {});

describe('Component Tests', () => {
  describe('Note Management Update Component', () => {
    let wrapper: Wrapper<NoteClass>;
    let comp: NoteClass;
    let noteServiceStub: SinonStubbedInstance<NoteService>;

    beforeEach(() => {
      noteServiceStub = sinon.createStubInstance<NoteService>(NoteService);

      wrapper = shallowMount<NoteClass>(NoteUpdateComponent, {
        store,
        localVue,
        router,
        provide: {
          alertService: () => new AlertService(store),
          noteService: () => noteServiceStub
        }
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.note = entity;
        noteServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(noteServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.note = entity;
        noteServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(noteServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });
  });
});
