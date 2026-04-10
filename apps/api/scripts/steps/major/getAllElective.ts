import { handleAxiosError } from '../../core/handleError';
import { http } from '../../core/http';

export const getAllElectiveExams = async () => {
  try {
    const res = await http.get(`/exams/elective`);

    console.log(`✅ SUCCESS : Fetched all elective exams`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);

    console.error('❌ ERROR : Failed to fetch all elective majors', error);
  }
};
