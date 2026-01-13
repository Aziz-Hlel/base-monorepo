import ENV from '@/config/env.variables';

// type ApiRoutes = {
//   [x: string]: (() => string) | ((id: string) => string) | ApiRoutes;
// };

const apiRoutes = {
  baseUrl: () => ENV.BASE_URL,
  health: () => '/health' as const, // ! make this api
  auth: {
    me: () => '/auth/me' as const,
    signIn: () => '/auth/login' as const,
    refresh: () => '/auth/refresh' as const,
    signUp: () => '/auth/register' as const,
    oAuthSignIn: () => '/auth/oauth/login' as const,
  },
  users: {
    getUsers: () => '/users' as const,
    createUserProfile: () => '/users/' as const,
    updateUserProfile: (id: string) => `/users/${id}` as const,
    deleteUserProfile: (id: string) => `/users/${id}` as const,
    disableUser: (id: string) => `/users/${id}/disable/` as const,
    enableUser: (id: string) => `/users/${id}/enable/` as const,
  },
  products: {
    getProducts: () => '/products' as const,
    createProduct: () => '/products/' as const,
    updateProduct: (id: string) => `/products/${id}` as const,
    deleteProduct: (id: string) => `/products/${id}` as const,
  },

  services: {
    emailContactUs: () => '/services/email/contact-us' as const,
    emailProperty: () => '/services/email/property' as const,
  },

  media: {
    presignedUrl: () => '/media/presigned-url' as const,
  },

  images: () => ENV.BASE_URL + '/images/',
};

export default apiRoutes;
