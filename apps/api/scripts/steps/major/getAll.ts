import { handleAxiosError } from '../../core/handleError';
import { http } from '../../core/http';

export const getAllMajors = async () => {
  try {
    const res = await http.get('/majors');

    console.log(`✅ SUCCESS : Fetched all majors`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);

    console.error('❌ ERROR : Failed to fetch all majors', error);
  }
};
