import { SelectedRowProvider } from './context/selected-row-provider';
import Main from './Main';

const NotificationIndex = () => {
  return (
    <SelectedRowProvider>
      <Main />
    </SelectedRowProvider>
  );
};

export default NotificationIndex;
