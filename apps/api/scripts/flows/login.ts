import { serverLogin } from '../steps/auth/login';
import { firebaseLogin } from '../steps/firebase/login';

export const loginFlow = async () => {
  await firebaseLogin();
  const payload = await serverLogin();

  return payload;
};
