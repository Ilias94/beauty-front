import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { GetCategoriesAction } from './category.actions';
import { CategoryControllerService } from '../../../api/services';
import { tap } from 'rxjs';
import { CategoryDto } from '../../../api/models';

export class CategoryStateModel {
  public categories: CategoryDto[]
}

const defaults = {
  categories: []
};

@State<CategoryStateModel>({
  name: 'category',
  defaults
})
@Injectable()
export class CategoryState {
  constructor(private categoryControllerService: CategoryControllerService) {}

  @Action(GetCategoriesAction)
  getCategories({ patchState }: StateContext<CategoryStateModel>, { }: GetCategoriesAction) {
    return this.categoryControllerService.getAllCategories().pipe(tap(response => {
      patchState({categories: response})
    }))
  }
}
