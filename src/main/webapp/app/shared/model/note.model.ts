export interface INote {
  id?: number;
  label?: string;
  description?: string;
  dueDate?: Date;
}

export class Note implements INote {
  constructor(public id?: number, public label?: string, public description?: string, public dueDate?: Date) {}
}
