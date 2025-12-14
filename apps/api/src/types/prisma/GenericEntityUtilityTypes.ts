

export type GenericEntityCreateInput<T, K extends keyof T = never> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | K>;

export type GenericEntityResponse<T, K extends keyof T = never> = Omit<T, K>;
