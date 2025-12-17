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


  return (
    <div>
      <BreadcrumbHeader
        breadcrumbs={[
          { title: 'User', href: '/users' },
          { title: 'Profile', href: '/users/profile' },
        ]}
      />
      <div className=" w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>Manage your users and their roles here.</CardDescription>
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
