import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../types/post';

@Injectable()
export class PostService {
  private baseUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  getPostById(postId: number): Observable<Post> {
    const url = `${this.baseUrl}/${postId}`;
    return this.http.get<Post>(url);
  }
}
