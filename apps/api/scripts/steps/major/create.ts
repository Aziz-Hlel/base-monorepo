import { handleAxiosError } from '../../core/handleError';
import { http } from '../../core/http';

export const createMajor = async () => {
  try {
    const res = await http.post('/majors', {
      name: 'COMPUTER_SCIENCE',
    });

    console.log(`✅ SUCCESS : Created major`);
    return res.data.body;
  } catch (error) {
    handleAxiosError(error);

    console.error('❌ ERROR : Failed to create major', error);
  }
};
