import { AxiosError } from 'axios';

export const handleAxiosError = (error: unknown) => {
  if (error instanceof AxiosError) {
    console.error('❌ AXIOS ERROR : ', error.response?.data);
    process.exit(1);
  }
};
