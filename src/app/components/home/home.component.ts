import { Component } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { AlbumsService } from '../../services/albums.service';
import { PhotosService } from '../../services/photos.service';
import { Observable } from 'rxjs';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Post } from '../../types/post';
import { Album } from '../../types/album';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ks-home',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [PostsService, AlbumsService, PhotosService],
})
export class HomeComponent {
  totalPosts$: Observable<number>;
  totalAlbums$: Observable<number>;
  totalPhotos$: Observable<number>;

  posts$: Observable<Post[]>;
  albums$: Observable<Album[]>;

  constructor(
    private postsService: PostsService,
    private albumsService: AlbumsService,
    private photosService: PhotosService
  ) {
    this.totalPosts$ = this.postsService.total$;
    this.posts$ = this.postsService.posts$;
    this.postsService.state = {
      page: 1,
      pageSize: 10,
      searchTerm: '',
      sortColumn: '',
      sortDirection: '',
    };

    this.totalAlbums$ = this.albumsService.total$;
    this.albums$ = this.albumsService.albums$;
    this.albumsService.state = {
      page: 1,
      pageSize: 10,
      searchTerm: '',
      sortColumn: '',
      sortDirection: '',
    };

    this.totalPhotos$ = this.photosService.total$;
    this.photosService.state = {
      page: 1,
      pageSize: 10,
      searchTerm: '',
      sortColumn: '',
      sortDirection: '',
    };
  }
}
