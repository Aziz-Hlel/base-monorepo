import ENV from '@/config/ENV';
import axios from 'axios';

export const validateOneSignalConfig = async () => {
  try {
    await axios.get(`https://onesignal.com/api/v1/apps/${ENV.ONE_SIGNAL_APP_ID}`, {
      headers: {
        Authorization: `Basic ${ENV.ONE_SIGNAL_APP_SECRET}`,
      },
    });

    console.log('✅ SUCCESS : OneSignal configuration is valid');
  } catch (error) {
    console.error('❌ ERROR : OneSignal configuration is INVALID');
    throw error;
  }
};
