import { context } from '../../core/context';
import { handleAxiosError } from '../../core/handleError';
import { http } from '../../core/http';

export const createElectiveExam = async () => {
  try {
    const res = await http.post('/exams', {
      subject: 'SPANISH',
      date: '2026-04-09',
      startTime: '08:00',
      endTime: '12:00',
      timeOfDay: 'MORNING',
      term: 'PRINCIPAL',
      isOptional: true,
    });

    console.log(`✅ SUCCESS : Created elective exam`);
    context.electiveExamId = res.data.id;
    return res.data;
  } catch (error) {
    handleAxiosError(error);

    console.error('❌ ERROR : Failed to create elective exam', error);
  }
};
