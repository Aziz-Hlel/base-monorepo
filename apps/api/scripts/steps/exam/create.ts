import { context } from '../../core/context';
import { handleAxiosError } from '../../core/handleError';
import { http } from '../../core/http';

export const createExam = async () => {
  try {
    const res = await http.post('/exams', {
      subject: 'ALGO',
      date: '2026-04-09',
      startTime: '08:00',
      endTime: '12:00',
      timeOfDay: 'MORNING',
      term: 'PRINCIPAL',
      isOptional: false,
      majorId: context.majorId,
    });

    context.examId = res.data.id;

    console.log(`✅ SUCCESS : Created exam`);
    return res.data;
  } catch (error) {
    handleAxiosError(error);

    console.error('❌ ERROR : Failed to create exam', error);
  }
};
