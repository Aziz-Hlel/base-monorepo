import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import BreadcrumbHeader from '@/pages/Header';
import { Button } from '../ui/button';
import MainTable from './Table';
import { useSelectedRow } from './context/selected-row-provider';
import DialogContainer from './dialogs/DialogContainer';
import { TableData } from './core/core';

const Main = () => {
  const { handleDialogStateChange } = useSelectedRow();
  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: TableData.MainCard.title, href: TableData.href }]} />
      <div className="w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{TableData.MainCard.title}</CardTitle>
            <CardDescription>{TableData.MainCard.description}</CardDescription>
            <CardAction>
              <Button onClick={() => handleDialogStateChange({ openDialog: 'add' })}>
                {TableData.MainCard.addButton.label}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <MainTable />
            <DialogContainer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Main;
