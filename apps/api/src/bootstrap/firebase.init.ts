// src/firebase/index.ts
import ENV from '@/config/ENV';
import { initializeApp, getApps, getApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { logger } from './logger.init';

const initializeFirebaseApp = (): App => {
  try {
    const serviceAccount = JSON.parse(ENV.FIREBASE_CERT);

    const app = getApps().length ? getApp() : initializeApp({ credential: cert(serviceAccount) });
    logger.info('✅ SUCCESS : Firebase initialized successfully.');
    return app;
  } catch (err) {
    if (err instanceof SyntaxError)
      logger.error('❌ FATAL: Could not parse FIREBASE_CERT JSON, FIREBASE_CERT is Malformed.');
    else logger.error(err, 'Invalid FIREBASE_CERT:');
    process.exit(1);
  }
};

const app = initializeFirebaseApp();

export const firebaseSession = getAuth(app);
