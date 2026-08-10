export class LoadCourseMessagesAction {
  static readonly type = '[GroupChat] Load Messages';
  constructor(public courseId: number) {}
}

export class SendCourseMessageAction {
  static readonly type = '[GroupChat] Send';
  constructor(public courseId: number, public content: string) {}
}

export class ReceiveCourseMessageAction {
  static readonly type = '[GroupChat] Receive (WS)';
  constructor(public message: CourseMessage) {}
}

export class ClearCourseMessagesAction {
  static readonly type = '[GroupChat] Clear';
}

export class LoadMyChatCoursesAction {
  static readonly type = '[GroupChat] Load My Chat Courses';
}

export interface CourseSummary {
  id: number;
  title: string;
}

export interface CourseMessage {
  id: number;
  courseId: number;
  senderId: number;
  senderFirstName: string;
  senderLastName: string;
  senderFileName?: string;
  content: string;
  sentAt: string;
}
