<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <div v-if="note">
                <h2 class="jh-entity-heading"><span>Note</span> {{note.id}}</h2>
                <dl class="row jh-entity-details">
                    <dt>
                        <span>Label</span>
                    </dt>
                    <dd>
                        <span>{{note.label}}</span>
                    </dd>
                    <dt>
                        <span>Description</span>
                    </dt>
                    <dd>
                        <span>{{note.description}}</span>
                    </dd>
                    <dt>
                        <span>Due Date</span>
                    </dt>
                    <dd>
                        <span>{{note.dueDate}}</span>
                    </dd>
                </dl>
                <button type="submit"
                        v-on:click.prevent="previousState()"
                        class="btn btn-info">
                    <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span> Back</span>
                </button>
                <router-link v-if="note.id" :to="{name: 'NoteEdit', params: {noteId: note.id}}" tag="button" class="btn btn-primary">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span> Edit</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./note-details.component.ts">
</script>
