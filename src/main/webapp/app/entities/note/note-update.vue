<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <form name="editForm" role="form" novalidate v-on:submit.prevent="save()" >
                <h2 id="jhipsterApp.note.home.createOrEditLabel">Create or edit a Note</h2>
                <div>
                    <div class="form-group" v-if="note.id">
                        <label for="id">ID</label>
                        <input type="text" class="form-control" id="id" name="id"
                               v-model="note.id" readonly />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="note-label">Label</label>
                        <input type="text" class="form-control" name="label" id="note-label"
                            :class="{'valid': !$v.note.label.$invalid, 'invalid': $v.note.label.$invalid }" v-model="$v.note.label.$model" />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="note-description">Description</label>
                        <input type="text" class="form-control" name="description" id="note-description"
                            :class="{'valid': !$v.note.description.$invalid, 'invalid': $v.note.description.$invalid }" v-model="$v.note.description.$model" />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" for="note-dueDate">Due Date</label>
                        <div class="input-group">
                            <input id="note-dueDate" type="date" class="form-control" name="dueDate"  :class="{'valid': !$v.note.dueDate.$invalid, 'invalid': $v.note.dueDate.$invalid }"
                            v-model="$v.note.dueDate.$model"  />
                        </div>
                    </div>
                </div>
                <div>
                    <button type="button" id="cancel-save" class="btn btn-secondary" v-on:click="previousState()">
                        <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span>Cancel</span>
                    </button>
                    <button type="submit" id="save-entity" :disabled="$v.note.$invalid || isSaving" class="btn btn-primary">
                        <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span>Save</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts" src="./note-update.component.ts">
</script>
