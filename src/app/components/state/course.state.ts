import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { FilterCoursesByDateAction, GetAutocompleteTitleAction, GetCourseByIdAction, GetPageCoursesAction, SaveCourseAction} from './course.actions';
import { CourseControllerService } from '../../../api/services';
import { tap } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { CourseDtoResponse, PageCourseDtoResponse } from '../../../api/models';


export class CourseStateModel {
  public pageCourses: PageCourseDtoResponse;
  public course: CourseDtoResponse;
  public titleAutocomplete: string[]
  public coursesByDate: CourseDtoResponse[]
}

const defaults = {
  pageCourses: {},
  course: {},
  titleAutocomplete: [],
  coursesByDate: []
};

@State<CourseStateModel>({
  name: 'course',
  defaults
})
@Injectable()
export class CourseState {
  constructor(private courseControllerService: CourseControllerService) { }

  @Action(GetPageCoursesAction)
  getCourses({ patchState }: StateContext<CourseStateModel>, { page, size, categoryId, title, sortBy, sortDirection, isCurrentCreator, isCurrentStudent }: GetPageCoursesAction) {
    return this.courseControllerService.getCourses({ page, size, categoryId, title, sortBy, sortDirection, isCurrentCreator, isCurrentStudent }).pipe(tap(response => {
      patchState({ pageCourses: response })
    }))
  }

  @Action(SaveCourseAction)
  saveCourse({ }: StateContext<CourseStateModel>, { course }: SaveCourseAction) {
    return this.courseControllerService.createCourse({ body: course })
  }

  @Action(GetCourseByIdAction)
  getCourse({ patchState }: StateContext<CourseStateModel>, { courseId }: GetCourseByIdAction) {
    return this.courseControllerService.getCourseById({ id: courseId }).pipe(tap(response => {
      patchState({ course: response })
    }))
  }
  @Action(GetAutocompleteTitleAction)
  getAutocompleteTitles({ patchState }: StateContext<CourseStateModel>, { title }: GetAutocompleteTitleAction) {
    return this.courseControllerService.getAutocompleteTitle({ title }).pipe(tap(response => {
      patchState({ titleAutocomplete: response })
    }))
  }

  @Action(FilterCoursesByDateAction)
  filterCourseByDate({ patchState }: StateContext<CourseStateModel>, { from, to }: FilterCoursesByDateAction) {
    return this.courseControllerService.filterCoursesByDate({ from, to }).pipe(tap(response => {
      patchState({ coursesByDate: response })
    }))
  }

}
