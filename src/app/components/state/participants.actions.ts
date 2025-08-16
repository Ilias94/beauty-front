export class GetParticipantsAction {
  static readonly type = '[Participants] GetParticipantsAction';
  constructor(public courseId: number) { }
}
