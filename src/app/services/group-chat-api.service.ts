import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enfironment';
import { CourseMessage } from '../components/state/group-chat.actions';

@Injectable({ providedIn: 'root' })
export class GroupChatApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/courses`;

  getMessages(courseId: number): Observable<CourseMessage[]> {
    return this.http.get<CourseMessage[]>(`${this.base}/${courseId}/messages`);
  }

  send(courseId: number, content: string): Observable<CourseMessage> {
    return this.http.post<CourseMessage>(`${this.base}/${courseId}/messages`, { content });
  }
}
