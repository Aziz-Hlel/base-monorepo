import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { Outlet } from 'react-router-dom';
import type { UserProfileResponse } from '@contracts/schemas/profile/UserProfileResponse';

const UserSessionContext = createContext<UserProfileResponse | undefined>(undefined);
export function UserSessionProvider() {
  const { user } = useAuth();

  if (!user) return <> User still not defined when passed through UserProvider Context </>;

  return (
    <UserSessionContext.Provider value={user}>
      <Outlet />
    </UserSessionContext.Provider>
  );
}

export const useUser = (): UserProfileResponse => {
  const user = useContext(UserSessionContext);

  if (user === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return user;
};
