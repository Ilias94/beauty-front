import { CourseDtoRequest } from "../../../api/models";


export class GetPageCoursesAction {
  static readonly type = '[Course] GetPageCoursesAction';
  constructor(public page: number, public size: number, public categoryId?: number,
    public title?: string, public sortBy?: string,
    public sortDirection?: 'ASC' | 'DESC', public isCurrentCreator?: boolean,
    public isCurrentStudent?: boolean, public hidePast?: boolean,
    public city?: string,
    public courseType?: 'IN_PERSON' | 'ONLINE' | 'HYBRID') { }
}

export class GetDistinctCitiesAction {
  static readonly type = '[Course] GetDistinctCitiesAction';
}

export class UpdateCourseAction {
  static readonly type = '[Course] UpdateCourseAction';
  constructor(public id: number, public course: CourseDtoRequest) { }
}

export class SaveCourseAction {
  static readonly type = '[Course] SaveCourseAction';
  constructor(public course: CourseDtoRequest) { }
}

export class GetCourseByIdAction {
  static readonly type = '[Course] GetCourseByIdAction';
  constructor(public courseId: number) { }
}

export class GetAutocompleteTitleAction {
  static readonly type = '[Course] GetAutocompleteTitleAction';
  constructor(public title: string) { }
}

export class FilterCoursesByDateAction {
  static readonly type = '[Course] FilterCoursesByDate';
  constructor(public from: string, public to: string) { }
}
