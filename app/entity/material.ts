import { MaterialFile } from './materialFile';
import { User } from './user';
import { File } from './file';

export interface Category{
  id?: number,
  name: string,
  description?: string,
}

export interface Material {
  title: string,
  description: string,
  id?: number,
  files: MaterialFile[],
  users: User[],
  categoryId?: number,
  category: Category,
  coverId?: number,
  cover: File,
  background: string,
}