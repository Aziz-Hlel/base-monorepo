import { context } from '../../core/context';
import { handleAxiosError } from '../../core/handleError';
import { http } from '../../core/http';

export const getExamById = async () => {
  try {
    const res = await http.get(`/exams/${context.examId}`);

    console.log(`✅ SUCCESS : Fetched exam by id`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);

    console.error('❌ ERROR : Failed to fetch exam by id', error);
  }
};
