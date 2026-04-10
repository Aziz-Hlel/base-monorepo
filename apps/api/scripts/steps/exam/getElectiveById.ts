import { context } from '../../core/context';
import { handleAxiosError } from '../../core/handleError';
import { http } from '../../core/http';

export const getElectiveExamById = async () => {
  try {
    const res = await http.get(`/exams/${context.electiveExamId}`);

    console.log(`✅ SUCCESS : Fetched elective exam by id`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);

    console.error('❌ ERROR : Failed to fetch elective exam by id', error);
  }
};
