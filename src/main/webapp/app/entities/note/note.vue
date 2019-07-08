<template>
    <div>
        <h2 id="page-heading">
            <span id="note-heading">Notes</span>
            <router-link :to="{name: 'NoteCreate'}" tag="button" id="jh-create-entity" class="btn btn-primary float-right jh-create-entity create-note">
                <font-awesome-icon icon="plus"></font-awesome-icon>
                <span >
                    Create new Note
                </span>
            </router-link>
        </h2>
        <b-alert :show="dismissCountDown"
            dismissible
            :variant="alertType"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged">
            {{alertMessage}}
        </b-alert>
        <br/>
        <div class="alert alert-warning" v-if="!isFetching && notes && notes.length === 0">
            <span>No notes found</span>
        </div>
        <div class="table-responsive" v-if="notes && notes.length > 0">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th><span>ID</span></th>
                    <th><span>Label</span></th>
                    <th><span>Description</span></th>
                    <th><span>Due Date</span></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="note in notes"
                    :key="note.id">
                    <td>
                        <router-link :to="{name: 'NoteView', params: {noteId: note.id}}">{{note.id}}</router-link>
                    </td>
                    <td>{{note.label}}</td>
                    <td>{{note.description}}</td>
                    <td>{{note.dueDate}}</td>
                    <td class="text-right">
                        <div class="btn-group flex-btn-group-container">
                            <router-link :to="{name: 'NoteView', params: {noteId: note.id}}" tag="button" class="btn btn-info btn-sm details">
                                <font-awesome-icon icon="eye"></font-awesome-icon>
                                <span class="d-none d-md-inline">View</span>
                            </router-link>
                            <router-link :to="{name: 'NoteEdit', params: {noteId: note.id}}"  tag="button" class="btn btn-primary btn-sm edit">
                                <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                                <span class="d-none d-md-inline">Edit</span>
                            </router-link>
                            <b-button v-on:click="duplicateNote(note)"
                                   variant="warning"
                                   class="btn btn-sm">
                                <font-awesome-icon icon="plus"></font-awesome-icon>
                                <span class="d-none d-md-inline">Duplicate</span>
                            </b-button>
                            <b-button v-on:click="prepareRemove(note)"
                                   variant="danger"
                                   class="btn btn-sm"
                                   v-b-modal.removeEntity>
                                <font-awesome-icon icon="times"></font-awesome-icon>
                                <span class="d-none d-md-inline">Delete</span>
                            </b-button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <b-modal ref="removeEntity" id="removeEntity" >
            <span slot="modal-title"><span id="jhipsterApp.note.delete.question">Confirm delete operation</span></span>
            <div class="modal-body">
                <p id="jhi-delete-note-heading" >Are you sure you want to delete this Note?</p>
            </div>
            <div slot="modal-footer">
                <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">Cancel</button>
                <button type="button" class="btn btn-primary" id="jhi-confirm-delete-note" v-on:click="removeNote()">Delete</button>
            </div>
        </b-modal>
    </div>
</template>

<script lang="ts" src="./note.component.ts">
</script>
