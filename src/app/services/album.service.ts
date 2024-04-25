import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album } from '../types/album';
import { Photo } from '../types/photo';

@Injectable()
export class AlbumService {
  private baseUrl = 'https://jsonplaceholder.typicode.com/albums';

  constructor(private http: HttpClient) {}

  getAlbumById(albumId: number): Observable<Album> {
    const url = `${this.baseUrl}/${albumId}`;
    return this.http.get<Album>(url);
  }

  getPhotosByAlbumId(albumId: number): Observable<Photo[]> {
    const url = `${this.baseUrl}/${albumId}/photos`;
    return this.http.get<Photo[]>(url);
  }
}
