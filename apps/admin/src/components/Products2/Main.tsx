import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import BreadcrumbHeader from '@/pages/Header';
import { Button } from '../ui/button';
import MainTable from './Table';
import { useSelectedRow } from './context/selected-row-provider';
import DialogContainer from './dialogs/DialogContainer';
import { CARD_DATA } from './core/core';

const Main = () => {
  const { handleDialogChange } = useSelectedRow();
  return (
    <div>
      <BreadcrumbHeader breadcrumbs={[{ title: CARD_DATA.title, href: '/offers' }]} />
      <div className=" w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{CARD_DATA.title}</CardTitle>
            <CardDescription>{CARD_DATA.description}</CardDescription>
            <CardAction>
              <Button onClick={() => handleDialogChange('add')}>{CARD_DATA.addButton.label}</Button>
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
