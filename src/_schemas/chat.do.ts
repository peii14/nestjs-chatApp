import { Types } from 'mongoose';

export class ChatDo {
  _id: Types.ObjectId;
  members: Array<Types.ObjectId>;
  vn?: string;
  emossion?: string;

  constructor(props: Partial<ChatDo>) {
    this._id = props._id || null;
    this.members = props.members || null;
    this.vn = props.vn || null;
    this.emossion = props.emossion || null;
  }
}
