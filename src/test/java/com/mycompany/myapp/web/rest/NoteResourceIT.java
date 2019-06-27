package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.JhipsterApp;
import com.mycompany.myapp.domain.Note;
import com.mycompany.myapp.repository.NoteRepository;
import com.mycompany.myapp.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link NoteResource} REST controller.
 */
@SpringBootTest(classes = JhipsterApp.class)
public class NoteResourceIT {

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DUE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DUE_DATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restNoteMockMvc;

    private Note note;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final NoteResource noteResource = new NoteResource(noteRepository);
        this.restNoteMockMvc = MockMvcBuilders.standaloneSetup(noteResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Note createEntity(EntityManager em) {
        Note note = new Note()
            .label(DEFAULT_LABEL)
            .description(DEFAULT_DESCRIPTION)
            .dueDate(DEFAULT_DUE_DATE);
        return note;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Note createUpdatedEntity(EntityManager em) {
        Note note = new Note()
            .label(UPDATED_LABEL)
            .description(UPDATED_DESCRIPTION)
            .dueDate(UPDATED_DUE_DATE);
        return note;
    }

    @BeforeEach
    public void initTest() {
        note = createEntity(em);
    }

    @Test
    @Transactional
    public void createNote() throws Exception {
        int databaseSizeBeforeCreate = noteRepository.findAll().size();

        // Create the Note
        restNoteMockMvc.perform(post("/api/notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(note)))
            .andExpect(status().isCreated());

        // Validate the Note in the database
        List<Note> noteList = noteRepository.findAll();
        assertThat(noteList).hasSize(databaseSizeBeforeCreate + 1);
        Note testNote = noteList.get(noteList.size() - 1);
        assertThat(testNote.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testNote.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testNote.getDueDate()).isEqualTo(DEFAULT_DUE_DATE);
    }

    @Test
    @Transactional
    public void createNoteWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = noteRepository.findAll().size();

        // Create the Note with an existing ID
        note.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restNoteMockMvc.perform(post("/api/notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(note)))
            .andExpect(status().isBadRequest());

        // Validate the Note in the database
        List<Note> noteList = noteRepository.findAll();
        assertThat(noteList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllNotes() throws Exception {
        // Initialize the database
        noteRepository.saveAndFlush(note);

        // Get all the noteList
        restNoteMockMvc.perform(get("/api/notes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(note.getId().intValue())))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].dueDate").value(hasItem(DEFAULT_DUE_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getNote() throws Exception {
        // Initialize the database
        noteRepository.saveAndFlush(note);

        // Get the note
        restNoteMockMvc.perform(get("/api/notes/{id}", note.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(note.getId().intValue()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.dueDate").value(DEFAULT_DUE_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingNote() throws Exception {
        // Get the note
        restNoteMockMvc.perform(get("/api/notes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateNote() throws Exception {
        // Initialize the database
        noteRepository.saveAndFlush(note);

        int databaseSizeBeforeUpdate = noteRepository.findAll().size();

        // Update the note
        Note updatedNote = noteRepository.findById(note.getId()).get();
        // Disconnect from session so that the updates on updatedNote are not directly saved in db
        em.detach(updatedNote);
        updatedNote
            .label(UPDATED_LABEL)
            .description(UPDATED_DESCRIPTION)
            .dueDate(UPDATED_DUE_DATE);

        restNoteMockMvc.perform(put("/api/notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedNote)))
            .andExpect(status().isOk());

        // Validate the Note in the database
        List<Note> noteList = noteRepository.findAll();
        assertThat(noteList).hasSize(databaseSizeBeforeUpdate);
        Note testNote = noteList.get(noteList.size() - 1);
        assertThat(testNote.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testNote.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testNote.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingNote() throws Exception {
        int databaseSizeBeforeUpdate = noteRepository.findAll().size();

        // Create the Note

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNoteMockMvc.perform(put("/api/notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(note)))
            .andExpect(status().isBadRequest());

        // Validate the Note in the database
        List<Note> noteList = noteRepository.findAll();
        assertThat(noteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteNote() throws Exception {
        // Initialize the database
        noteRepository.saveAndFlush(note);

        int databaseSizeBeforeDelete = noteRepository.findAll().size();

        // Delete the note
        restNoteMockMvc.perform(delete("/api/notes/{id}", note.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Note> noteList = noteRepository.findAll();
        assertThat(noteList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Note.class);
        Note note1 = new Note();
        note1.setId(1L);
        Note note2 = new Note();
        note2.setId(note1.getId());
        assertThat(note1).isEqualTo(note2);
        note2.setId(2L);
        assertThat(note1).isNotEqualTo(note2);
        note1.setId(null);
        assertThat(note1).isNotEqualTo(note2);
    }
}
