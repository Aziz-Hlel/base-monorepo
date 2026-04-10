import { context } from '../../core/context';
import { handleAxiosError } from '../../core/handleError';
import { http } from '../../core/http';

export const getMajorById = async () => {
  try {
    const res = await http.get(`/majors/${context.majorId}`);

    console.log(`✅ SUCCESS : Fetched major by id`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);

    console.error('❌ ERROR : Failed to fetch major by id', error);
  }
};
