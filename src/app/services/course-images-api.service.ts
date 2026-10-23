import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enfironment';
import { CourseImageDto } from '../../api/models';

/**
 * A course's photo gallery. Written by hand rather than through the generated client, because the
 * upload reports its progress (each photo shows a filling ring while it goes up).
 */
@Injectable({ providedIn: 'root' })
export class CourseImagesApiService {
  private http = inject(HttpClient);
  private base = (courseId: number) => `${environment.apiUrl}/api/v1/courses/${courseId}/images`;

  list(courseId: number): Observable<CourseImageDto[]> {
    return this.http.get<CourseImageDto[]>(this.base(courseId));
  }

  upload(courseId: number, photos: Blob[]): Observable<HttpEvent<CourseImageDto[]>> {
    const body = new FormData();
    photos.forEach((photo, i) => body.append('files', photo, `photo-${i}.${photo.type === 'image/webp' ? 'webp' : 'jpg'}`));
    return this.http.post<CourseImageDto[]>(this.base(courseId), body, { reportProgress: true, observe: 'events' });
  }

  reorder(courseId: number, imageIds: number[]): Observable<CourseImageDto[]> {
    return this.http.put<CourseImageDto[]>(`${this.base(courseId)}/order`, imageIds);
  }

  delete(courseId: number, imageId: number): Observable<CourseImageDto[]> {
    return this.http.delete<CourseImageDto[]>(`${this.base(courseId)}/${imageId}`);
  }
}
