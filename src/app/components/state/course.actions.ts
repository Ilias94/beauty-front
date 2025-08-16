import { CourseDtoRequest } from "../../../api/models";


export class GetPageCoursesAction {
  static readonly type = '[Course] GetPageCoursesAction';
  constructor(public page: number, public size: number, public categoryId?: number,
    public title?: string, public sortBy?: string,
    public sortDirection?: 'ASC' | 'DESC', public isCurrentCreator?: boolean,
  public isCurrentStudent?: boolean) { }
}

export class SaveCourseAction {
  static readonly type = '[Course] SaveCourseAction';
  constructor(public course: CourseDtoRequest) { }
}

export class SignUpCourseAction {
  static readonly type = '[Course] SignUpCourseAction';
  constructor(public courseId: number) { }
}

export class GetCourseByIdAction {
  static readonly type = '[Course] GetCourseByIdAction';
  constructor(public courseId: number) { }
}

export class GetAutocompleteTitleAction {
  static readonly type = '[Course] GetAutocompleteTitleAction';
  constructor(public title: string) { }
}
