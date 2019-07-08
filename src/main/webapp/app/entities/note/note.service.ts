import axios from 'axios';

import { INote } from '@/shared/model/note.model';

const baseApiUrl = 'api/notes';

export default class NoteService {
  public find(id: number): Promise<INote> {
    return new Promise<INote>(resolve => {
      axios.get(`${baseApiUrl}/${id}`).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public retrieve(): Promise<any> {
    return new Promise<any>(resolve => {
      axios.get(baseApiUrl).then(function(res) {
        resolve(res);
      });
    });
  }

  public delete(id: number): Promise<any> {
    return new Promise<any>(resolve => {
      axios.delete(`${baseApiUrl}/${id}`).then(function(res) {
        resolve(res);
      });
    });
  }

  public duplicate(id: number): Promise<any> {
    return new Promise<any>(resolve => {
      axios.post(`${baseApiUrl}/${id}/duplicate`).then(function(res) {
        resolve(res);
      });
    });
  }

  public create(entity: INote): Promise<INote> {
    return new Promise<INote>(resolve => {
      axios.post(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }

  public update(entity: INote): Promise<INote> {
    return new Promise<INote>(resolve => {
      axios.put(`${baseApiUrl}`, entity).then(function(res) {
        resolve(res.data);
      });
    });
  }
}
