import testFirebaseConnection from './test-connection/firebase.test.connection';
import { testDbConnection } from './test-connection/db.test.connection';
import { connectRedis } from './redis.init';
import seed from '@/seeds';
import { storageProviderTestConnection } from './test-connection/storageProvider.test.connection';
import testEmailTransporterConnection from './test-connection/email.test.connection';

const asyncBootstrapHandlers = async () => {
  await Promise.all([
    testFirebaseConnection(),
    testDbConnection(),
    connectRedis(),
    storageProviderTestConnection(),
    testEmailTransporterConnection(),
  ]);
  //
  await seed();
};

export default asyncBootstrapHandlers;
