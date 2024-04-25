import { Component } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../types/post';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'ks-post',
  standalone: true,
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  providers: [PostService],
})
export class PostComponent {
  post: Post | null = null;
  postId!: number;

  isLoading = false;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) {
    //
  }

  ngOnInit(): void {
    const postId = this.activatedRoute.snapshot.paramMap.get('id');
    if (postId) {
      try {
        this.postId = parseInt(postId, 10);
        this.getPost(this.postId);
      } catch (e) {
        // TODO
      }
    }
  }

  getPost(postId: number): void {
    this.isLoading = true;
    this.postService
      .getPostById(postId)
      .pipe(
        catchError((error) => {
          // TODO: handle error
          return of(error);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((post) => (this.post = post));
  }
}
