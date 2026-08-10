import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GroupChatApiService } from '../../services/group-chat-api.service';
import { CourseControllerService } from '../../../api/services/course-controller.service';
import {
  ClearCourseMessagesAction, CourseSummary, CourseMessage,
  LoadCourseMessagesAction, LoadMyChatCoursesAction,
  ReceiveCourseMessageAction, SendCourseMessageAction
} from './group-chat.actions';

export interface GroupChatStateModel {
  messages: CourseMessage[];
  myChatCourses: CourseSummary[];
}

@State<GroupChatStateModel>({ name: 'groupChat', defaults: { messages: [], myChatCourses: [] } })
@Injectable()
export class GroupChatState {

  constructor(private api: GroupChatApiService, private courseApi: CourseControllerService) {}

  @Action(LoadMyChatCoursesAction)
  loadMyChatCourses({ patchState }: StateContext<GroupChatStateModel>) {
    return forkJoin({
      enrolled: this.courseApi.getCourses({ isCurrentStudent: true, page: 0, size: 100 }),
      owned:    this.courseApi.getCourses({ isCurrentCreator: true, page: 0, size: 100 }),
    }).pipe(
      map(({ enrolled, owned }) => {
        const all = [...(enrolled.content ?? []), ...(owned.content ?? [])];
        const seen = new Set<number>();
        return all
          .filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; })
          .map(c => ({ id: c.id, title: c.title } as CourseSummary));
      }),
      tap(courses => patchState({ myChatCourses: courses }))
    );
  }

  @Action(LoadCourseMessagesAction)
  load({ patchState }: StateContext<GroupChatStateModel>, { courseId }: LoadCourseMessagesAction) {
    return this.api.getMessages(courseId).pipe(
      tap(messages => patchState({ messages }))
    );
  }

  @Action(SendCourseMessageAction)
  send({ getState, patchState }: StateContext<GroupChatStateModel>, { courseId, content }: SendCourseMessageAction) {
    return this.api.send(courseId, content).pipe(
      tap(message => {
        const msgs = getState().messages;
        if (!msgs.some(m => m.id === message.id)) {
          patchState({ messages: [...msgs, message] });
        }
      })
    );
  }

  @Action(ReceiveCourseMessageAction)
  receive({ getState, patchState }: StateContext<GroupChatStateModel>, { message }: ReceiveCourseMessageAction) {
    const messages = getState().messages;
    if (messages.some(m => m.id === message.id)) return;
    patchState({ messages: [...messages, message] });
  }

  @Action(ClearCourseMessagesAction)
  clear({ patchState }: StateContext<GroupChatStateModel>) {
    patchState({ messages: [] });
  }
}
