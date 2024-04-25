import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo } from '../types/photo';

@Injectable()
export class PhotoService {
  private baseUrl = 'https://jsonplaceholder.typicode.com/photos';

  constructor(private http: HttpClient) {}

  getPhotoById(photoId: number): Observable<Photo> {
    const url = `${this.baseUrl}/${photoId}`;
    return this.http.get<Photo>(url);
  }
}
