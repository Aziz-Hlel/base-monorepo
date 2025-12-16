import { apiService } from '@/Api/apiService';
import BreadcrumbHeader from './Header';
import UsersTable from '@/components/Users/Users';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const UserPage = () => {
  apiService
    .get('/users')
    .then((response) => {
      console.log('Users fetched:', response);
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
    });
  return (
    <div>
      <BreadcrumbHeader
        breadcrumbs={[
          { title: 'User', href: '/users' },
          { title: 'Profile', href: '/users/profile' },
        ]}
      />
      <div className=" w-8/12 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription></CardDescription>
            <CardAction>
              <Button>Add New User</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <UsersTable />
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserPage;
