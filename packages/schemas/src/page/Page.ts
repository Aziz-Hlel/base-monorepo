import type { Pageable } from './Pageable.js';

export type Page<T> = {
  content: T[];
  pagination: Pageable;
};
