import { CommentDto } from "../../../api/models";

export class SaveCommentAction {
  static readonly type = '[Comment] SaveCommentAction';
  constructor(public comment: CommentDto) { }

}

export class GetCommentsAction {
  static readonly type = '[Comment] GetCommentsAction';
  constructor(public courseId: number) { }
}

export class GetCurrentUserCommentsAction {
  static readonly type = '[Comment] GetCurrentUserCommentsAction';
  constructor() { }
}

export class ClearCommentsAction {
  static readonly type = '[Comment] ClearCommentsAction';
  constructor() { }
}
