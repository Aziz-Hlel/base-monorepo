type SeedTenantData = {
  account: {
    email: string;
    role: 'ADMIN';
  };
  owner: {};
  school: {
    name: string;
  };
};

const tenant1: SeedTenantData = {
  account: {
    email: 'tigana137@gmail.com',
    role: 'ADMIN',
  },
  owner: {},
  school: {
    name: 'School 1',
  },
} as const;

export const data = [tenant1];
