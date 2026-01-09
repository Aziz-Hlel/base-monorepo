import { firebaseSession } from '../firebase.init';
import { logger } from '../logger.init';

async function testFirebaseConnection() {
  try {
    // Attempt to list collections (lightweight read)
    await firebaseSession.listUsers(1);
    logger.info('✅ SUCCESS : Firebase credentials are valid and connected!');
  } catch (error) {
    logger.error('❌ ERROR : Firebase credentials rejected or network issue.');
    throw error;
  }
}

export default testFirebaseConnection;
