export const ENTITY_TYPE = {
  PRODUCT: 'PRODUCT',
  USER: 'USER',
} as const;

export type EntityType = keyof typeof ENTITY_TYPE;
