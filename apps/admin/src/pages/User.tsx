import { SelectedRowProvider } from '@/components/Users/context/selected-row-provider';
import UsersIndex from '@/components/Users/Users.index';

const UserPage = () => (
  <SelectedRowProvider>
    <UsersIndex />
  </SelectedRowProvider>
);

export default UserPage;
