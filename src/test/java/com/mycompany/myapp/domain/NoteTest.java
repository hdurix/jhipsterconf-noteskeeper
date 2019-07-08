package com.mycompany.myapp.domain;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class NoteTest {

    @Test
    public void shouldDuplicateTheNote() {
        // GIVEN
        Note note = new Note().label("label").description("desc").dueDate(LocalDate.now());

        // WHEN
        Note duplicated = note.duplicate();

        // THEN
        assertThat(duplicated.getId()).isNull();
        assertThat(duplicated.getLabel()).isEqualTo(note.getLabel());
        assertThat(duplicated.getDescription()).isEqualTo(note.getDescription());
        assertThat(duplicated.getDueDate()).isEqualTo(note.getDueDate());
    }

}
