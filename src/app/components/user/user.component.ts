import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../../types/user';
import { catchError, finalize, of } from 'rxjs';
import { Album } from '../../types/album';
import { Post } from '../../types/post';

@Component({
  selector: 'ks-user',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [UserService],
})
export class UserComponent {
  user: User | null = null;
  userId!: number;
  albums: Album[] = [];
  posts: Post[] = [];

  isLoading = false;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {
    //
  }

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.paramMap.get('id');
    if (userId) {
      try {
        this.userId = parseInt(userId, 10);
        this.getUser(this.userId);
      } catch (e) {
        // TODO
      }
    }
  }

  getUser(userId: number): void {
    this.isLoading = true;
    this.userService
      .getUserById(userId)
      .pipe(
        catchError((error) => {
          // TODO: handle error
          return of(error);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((user) => {
        this.user = user;
        this.getAlbums(this.userId);
        this.getPosts(this.userId);
      });
  }

  getAlbums(userId: number) {
    this.userService
      .getAlbumsByUserId(userId)
      .pipe(
        catchError((error) => {
          // TODO: handle error
          return of(error);
        })
      )
      .subscribe((albums) => {
        this.albums = albums;
      });
  }

  getPosts(userId: number) {
    this.userService
      .getPostsByUserId(userId)
      .pipe(
        catchError((error) => {
          // TODO: handle error
          return of(error);
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
      });
  }
}
