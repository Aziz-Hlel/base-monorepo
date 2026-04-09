import { MajorEnum, SubjectEnum, TermEnum, TimeOfDayEnum } from '@/generated/prisma/enums';

type ISeedData = {
  majors: {
    name: MajorEnum;
    exams: {
      subject: SubjectEnum;
      term: TermEnum;
      date: string;
      startTime: string;
      endTime: string;
      timeOfDay: TimeOfDayEnum;
      isOptional: false;
    }[];
  }[];
  electiveExams: {
    subject: SubjectEnum;
    term: TermEnum;
    timeOfDay: TimeOfDayEnum;
    date: string;
    startTime: string;
    endTime: string;
    isOptional: true;
  }[];
};

export const seedData: ISeedData = {
  majors: [
    {
      name: MajorEnum.COMPUTER_SCIENCE,
      exams: [
        // PRINCIPAL
        {
          subject: SubjectEnum.ALGO,
          term: TermEnum.PRINCIPAL,
          date: '2026-06-01',
          startTime: '08:00',
          endTime: '11:00',
          isOptional: false,
          timeOfDay: TimeOfDayEnum.MORNING,
        },
        {
          subject: SubjectEnum.MATH,
          term: TermEnum.PRINCIPAL,
          date: '2026-06-02',
          startTime: '08:00',
          endTime: '10:00',
          isOptional: false,
          timeOfDay: TimeOfDayEnum.MORNING,
        },
        {
          subject: SubjectEnum.ENGLISH,
          term: TermEnum.PRINCIPAL,
          date: '2026-06-03',
          startTime: '08:00',
          endTime: '10:30',
          isOptional: false,
          timeOfDay: TimeOfDayEnum.MORNING,
        },
        {
          subject: SubjectEnum.ARABIC,
          term: TermEnum.PRINCIPAL,
          date: '2026-06-04',
          startTime: '10:00',
          endTime: '12:00',
          isOptional: false,
          timeOfDay: TimeOfDayEnum.MORNING,
        },

        {
          subject: SubjectEnum.FRENCH,
          term: TermEnum.PRINCIPAL,
          date: '2026-06-05',
          startTime: '08:00',
          endTime: '10:00',
          isOptional: false,
          timeOfDay: TimeOfDayEnum.MORNING,
        },
        {
          subject: SubjectEnum.PHYSICS,
          term: TermEnum.PRINCIPAL,
          date: '2026-06-06',
          startTime: '08:00',
          endTime: '10:30',
          isOptional: false,
          timeOfDay: TimeOfDayEnum.MORNING,
        },

        // RETAKE
        {
          subject: SubjectEnum.ALGO,
          term: TermEnum.RETAKE,
          date: '2026-07-01',
          startTime: '08:00',
          endTime: '11:00',
          isOptional: false,
          timeOfDay: TimeOfDayEnum.MORNING,
        },
        {
          subject: SubjectEnum.MATH,
          term: TermEnum.RETAKE,
          date: '2026-07-02',
          startTime: '08:00',
          endTime: '10:00',
          isOptional: false,
          timeOfDay: TimeOfDayEnum.MORNING,
        },
        {
          subject: SubjectEnum.ENGLISH,
          term: TermEnum.RETAKE,
          date: '2026-07-03',
          startTime: '08:00',
          endTime: '10:30',
          isOptional: false,
          timeOfDay: TimeOfDayEnum.MORNING,
        },
        {
          subject: SubjectEnum.ARABIC,
          term: TermEnum.RETAKE,
          date: '2026-07-04',
          startTime: '10:00',
          endTime: '12:00',
          isOptional: false,
          timeOfDay: TimeOfDayEnum.MORNING,
        },

        {
          subject: SubjectEnum.FRENCH,
          term: TermEnum.RETAKE,
          date: '2026-07-05',
          startTime: '08:00',
          endTime: '10:00',
          isOptional: false,
          timeOfDay: TimeOfDayEnum.MORNING,
        },
        {
          subject: SubjectEnum.PHYSICS,
          term: TermEnum.RETAKE,
          date: '2026-07-06',
          startTime: '08:00',
          endTime: '10:30',
          isOptional: false,
          timeOfDay: TimeOfDayEnum.EVENING,
        },
      ],
    },
  ],
  electiveExams: [
    {
      subject: SubjectEnum.SPANISH,
      term: TermEnum.PRINCIPAL,
      timeOfDay: TimeOfDayEnum.EVENING,
      date: '2026-06-01',
      startTime: '14:00',
      endTime: '15:30',
      isOptional: true,
    },
    {
      subject: SubjectEnum.MUSIC,
      term: TermEnum.PRINCIPAL,
      timeOfDay: TimeOfDayEnum.EVENING,
      date: '2026-06-01',
      startTime: '14:00',
      endTime: '15:30',
      isOptional: true,
    },
    {
      subject: SubjectEnum.MUSIC,
      term: TermEnum.RETAKE,
      timeOfDay: TimeOfDayEnum.EVENING,
      date: '2026-06-01',
      startTime: '14:00',
      endTime: '15:30',
      isOptional: true,
    },
  ],
};
