import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enfironment';
import { ChatContact, ChatConversation, ChatMessage } from '../components/state/chat.actions';

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/v1/messages`;

  getConversations(): Observable<ChatConversation[]> {
    return this.http.get<ChatConversation[]>(`${this.base}/conversations`);
  }

  getMessages(partnerId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.base}/${partnerId}`);
  }

  getContacts(): Observable<ChatContact[]> {
    return this.http.get<ChatContact[]>(`${this.base}/contacts`);
  }

  send(recipientId: number, content: string, courseId?: number): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(this.base, { recipientId, content, courseId });
  }

  markAsRead(partnerId: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/${partnerId}/read`, {});
  }
}
