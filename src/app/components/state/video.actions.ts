export class LoadVideosAction {
  static readonly type = '[Video] LoadVideosAction';
  constructor(public courseId: number) { }
}

export class AddVideoAction {
  static readonly type = '[Video] AddVideoAction';
  constructor(public courseId: number, public files: File[]) { }
}

export class EditVideoDescriptionAction {
  static readonly type = '[Video] EditVideoDescriptionAction';
  constructor(public videoId: number, public description: string) { }
}

export class DeleteVideoAction {
  static readonly type = '[Video] DeleteVideoAction';
  constructor(public videoId: number, public courseId: number) { }
}