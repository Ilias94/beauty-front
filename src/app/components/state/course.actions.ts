import { CourseDto } from "../../../api/models";

export class GetPageCoursesAction {
  static readonly type = '[Course] GetPageCoursesAction';
  constructor(public page: number, public size: number) { }
}

export class SaveCourseAction {
  static readonly type = '[Course] SaveCourseAction';
  constructor(public course: CourseDto) {}
}

export class SignUpCourseAction {
  static readonly type = '[Course] SignUpCourseAction';
  constructor(public courseId: number) {}
}

export class GetCourseByIdAction {
  static readonly type = '[CourseDetails] GetCourseByIdAction';
  constructor(public courseId: number) {}
}
