import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../types/user';
import { Album } from '../types/album';
import { Post } from '../types/post';

@Injectable()
export class UserService {
  private baseUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<User> {
    const url = `${this.baseUrl}/${userId}`;
    return this.http.get<User>(url);
  }

  getAlbumsByUserId(userId: number): Observable<Album[]> {
    const url = `${this.baseUrl}/${userId}/albums`;
    return this.http.get<Album[]>(url);
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    const url = `${this.baseUrl}/${userId}/posts`;
    return this.http.get<Post[]>(url);
  }
}
