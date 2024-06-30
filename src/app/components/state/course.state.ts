import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { GetCourseByIdAction, GetPageCoursesAction, SaveCourseAction, SignUpCourseAction } from './course.actions';
import { CourseControllerService } from '../../../api/services';
import { tap } from 'rxjs';
import { CourseDto, PageCourseDto } from '../../../api/models';
import { Navigate } from '@ngxs/router-plugin';
import { response } from 'express';


export class CourseStateModel {
  public pageCourses: PageCourseDto;
  public course: CourseDto;
}

const defaults = {
  pageCourses: {},
  course: {}

};

@State<CourseStateModel>({
  name: 'course',
  defaults
})
@Injectable()
export class CourseState {
  constructor(private courseControllerService: CourseControllerService) { }

  @Action(GetPageCoursesAction)
  getCourses({ patchState }: StateContext<CourseStateModel>, { page, size }: GetPageCoursesAction) {
    return this.courseControllerService.getCourses({ page, size }).pipe(tap(response => {
      patchState({ pageCourses: response })
    }))
  }

  @Action(SaveCourseAction)
  saveCourse({ }: StateContext<CourseStateModel>, { course }: SaveCourseAction) {
    return this.courseControllerService.createCourse({ body: course })
  }

  @Action(SignUpCourseAction)
  signUpCourse({dispatch}: StateContext<CourseStateModel>, {courseId}:  SignUpCourseAction) {
   const token = localStorage.getItem("token")
   if(!token) {
    dispatch(new Navigate(['/login']))
   }
  }

  @Action(GetCourseByIdAction)
  getCourse({patchState}: StateContext<CourseStateModel>, { courseId}: GetCourseByIdAction) {
    return this.courseControllerService.getCourseById({id: courseId}).pipe(tap(response => {
      patchState({course: response})
    }))
  }
}
