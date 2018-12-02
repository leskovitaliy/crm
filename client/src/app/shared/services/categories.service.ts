import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICategory } from '../interfaces';
import { Observable } from 'rxjs';
import { st } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) {
  }

  get(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>('/api/category');
  }

  getById(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`/api/category/${id}`);
  }

  create(name: string, img?: File): Observable<ICategory> {
    const fd = new FormData();

    if (img) {
      fd.append('image', img, img.name);
    }

    fd.append('name', name);

    return this.http.post<ICategory>('/api/category', fd);
  }

  update(id: string, name: string, img?: File): Observable<ICategory> {
    const fd = new FormData();

    if (img) {
      fd.append('image', img, img.name);
    }

    fd.append('name', name);

    return this.http.patch<ICategory>(`/api/category/${id}`, fd);
  }
}
