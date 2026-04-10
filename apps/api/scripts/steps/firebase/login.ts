import { AxiosError } from 'axios';
import { context } from '../../core/context';
import { http, updateToken } from '../../core/http';
import { handleAxiosError } from '../../core/handleError';

export const firebaseLogin = async () => {
  try {
    const signInUrl = `${context.firebaseUrl}/accounts:signInWithPassword?key=${context.firebaseApiKey}`;
    const res = await http.post(signInUrl, {
      email: context.email,
      password: context.password,
      returnSecureToken: true,
    });
    const token = res.data.idToken;
    context.token = token;
    updateToken();

    console.log(`✅ SUCCESS : Signed in to Firebase`);
  } catch (error) {
    handleAxiosError(error);

    console.log(error);
  }
};
