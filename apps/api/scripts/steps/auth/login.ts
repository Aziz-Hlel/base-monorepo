import { context } from '../../core/context';
import { handleAxiosError } from '../../core/handleError';
import { http } from '../../core/http';

export const serverLogin = async () => {
  try {
    const res = await http.post('/auth/login', {
      token: context.token,
    });

    console.log(`✅ SUCCESS : Signed in to server`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);

    console.error('❌ ERROR : Failed to sign in to server', error);
  }
};
