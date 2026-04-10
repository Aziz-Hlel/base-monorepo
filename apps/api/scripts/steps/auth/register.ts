import { context } from '../../core/context';
import { handleAxiosError } from '../../core/handleError';
import { http } from '../../core/http';

export const serverRegister = async () => {
  try {
    const res = await http.post('/auth/register', {
      token: context.token,
    });

    console.log(`✅ SUCCESS : Registered to Firebase`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);

    console.error('❌ ERROR : Failed to register to Firebase', error);
  }
};
