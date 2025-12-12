import testFirebaseConnection from '../firebase/boostrap/testFirebaseConnection';
import seed from '../seeds';
import { testDbConnection } from './db.connection';

const asyncBootstrapHandlers = async () => {
  await Promise.all([testFirebaseConnection(), testDbConnection(),]);
  await seed();

};

export default asyncBootstrapHandlers;
