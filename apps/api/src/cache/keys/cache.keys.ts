export const RedisKeys = {
  usersPage: (param: Object) => `users:page:${JSON.stringify(param)}`,
  user: (userId: string) => `user:${userId}`,
};
