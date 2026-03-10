import BreadcrumbHeader from '@/pages/Header';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import ProductsTable from './ProductsTable';
import { useSelectedRow } from './context/selected-row-provider';
import DialogContainer from './dialogs/DialogContainer';

const ProductsIndex = () => {
  const { handleDialogChange } = useSelectedRow();

  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: 'Products', href: '/products' }]} />
      <div className=" w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>Manage your products and their details here.</CardDescription>
            <CardAction>
              <Button onClick={() => handleDialogChange('add')}>Add New Product</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ProductsTable />
            <DialogContainer />
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProductsIndex;
