import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((e) => e.HomeComponent),
  },
  {
    path: 'posts',
    data: { breadcrumb: 'Posts' },
    loadComponent: () =>
      import('./components/posts/posts.component').then(
        (e) => e.PostsComponent
      ),
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./components/post/post.component').then((e) => e.PostComponent),
  },
  {
    path: 'albums',
    data: { breadcrumb: 'Albums' },
    loadComponent: () =>
      import('./components/albums/albums.component').then(
        (e) => e.AlbumsComponent
      ),
  },
  {
    path: 'albums/:id',
    loadComponent: () =>
      import('./components/album/album.component').then(
        (e) => e.AlbumComponent
      ),
  },
  {
    path: 'photos',
    data: { breadcrumb: 'Photos' },
    loadComponent: () =>
      import('./components/photos/photos.component').then(
        (e) => e.PhotosComponent
      ),
  },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./components/photo/photo.component').then(
        (e) => e.PhotoComponent
      ),
  },
  {
    path: 'user/:id',
    loadComponent: () =>
      import('./components/user/user.component').then((e) => e.UserComponent),
  },
];
