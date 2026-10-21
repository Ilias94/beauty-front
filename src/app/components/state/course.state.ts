import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { FilterCoursesByDateAction, GetAutocompleteTitleAction, GetCourseByIdAction, GetDistinctCitiesAction, GetPageCoursesAction, SaveCourseAction} from './course.actions';
import { CourseControllerService } from '../../../api/services';
import { tap } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';
import { CourseDtoResponse, PageCourseDtoResponse } from '../../../api/models';


export class CourseStateModel {
  public pageCourses: PageCourseDtoResponse;
  public course: CourseDtoResponse;
  public titleAutocomplete: string[];
  public coursesByDate: CourseDtoResponse[];
  public distinctCities: string[];
  public loadingByDate: boolean;
}

const defaults = {
  pageCourses: {},
  course: {},
  titleAutocomplete: [],
  coursesByDate: [],
  distinctCities: [],
  loadingByDate: false,
};

@State<CourseStateModel>({
  name: 'course',
  defaults
})
@Injectable()
export class CourseState {
  constructor(private courseControllerService: CourseControllerService) { }

  // The catalog searches as you type: a newer query cancels the one still in flight.
  @Action(GetPageCoursesAction, { cancelUncompleted: true })
  getCourses({ patchState }: StateContext<CourseStateModel>, { page, size, categoryId, title, sortBy, sortDirection, isCurrentCreator, isCurrentStudent, hidePast, city, courseType }: GetPageCoursesAction) {
    return this.courseControllerService.getCourses({ page, size, categoryId, title, city, courseType, sortBy, sortDirection, isCurrentCreator, isCurrentStudent, hidePast }).pipe(tap(response => {
      patchState({ pageCourses: response })
    }))
  }

  @Action(GetDistinctCitiesAction)
  getDistinctCities({ patchState }: StateContext<CourseStateModel>) {
    return this.courseControllerService.getDistinctCities().pipe(tap(cities => {
      patchState({ distinctCities: cities })
    }))
  }

  @Action(SaveCourseAction)
  saveCourse({ patchState }: StateContext<CourseStateModel>, { course }: SaveCourseAction) {
    // Kept as the current course, so the wizard knows the new id (it uploads the photos next).
    return this.courseControllerService.createCourse({ body: course }).pipe(tap(created => patchState({ course: created })));
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
    patchState({ loadingByDate: true });
    return this.courseControllerService.filterCoursesByDate({ from, to }).pipe(tap(response => {
      patchState({ coursesByDate: response, loadingByDate: false });
    }));
  }

}
