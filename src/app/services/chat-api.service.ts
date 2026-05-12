import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enfironment';
import { ChatConversation, ChatMessage } from '../components/state/chat.actions';

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

  send(recipientId: number, content: string): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(this.base, { recipientId, content });
  }

  markAsRead(partnerId: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/${partnerId}/read`, {});
  }
}
