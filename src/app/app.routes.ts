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
    children: [
      {
        path: ':id',
        data: { breadcrumb: ':id' },
        loadComponent: () =>
          import('./components/posts/post/post.component').then(
            (e) => e.PostComponent
          ),
      },
      {
        path: '',
        data: { breadcrumb: null },
        loadComponent: () =>
          import('./components/posts/posts.component').then(
            (e) => e.PostsComponent
          ),
      },
    ],
  },
  {
    path: 'albums',
    data: { breadcrumb: 'Albums' },
    children: [
      {
        path: ':id',
        data: { breadcrumb: ':id' },
        loadComponent: () =>
          import('./components/albums/albums.component').then(
            (e) => e.AlbumsComponent
          ),
      },
      {
        path: '',
        data: { breadcrumb: null },
        loadComponent: () =>
          import('./components/albums/album/album.component').then(
            (e) => e.AlbumComponent
          ),
      },
    ],
  },
  {
    path: 'photos',
    data: { breadcrumb: 'Photos' },

    children: [
      {
        path: ':id',
        data: { breadcrumb: ':id' },
        loadComponent: () =>
          import('./components/photo/photo.component').then(
            (e) => e.PhotoComponent
          ),
      },
      {
        path: '',
        data: { breadcrumb: null },
        loadComponent: () =>
          import('./components/photos/photos.component').then(
            (e) => e.PhotosComponent
          ),
      },
    ],
  },
  {
    path: 'user/:id',
    loadComponent: () =>
      import('./components/user/user.component').then((e) => e.UserComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/home/home.component').then((e) => e.HomeComponent),
  },
];
