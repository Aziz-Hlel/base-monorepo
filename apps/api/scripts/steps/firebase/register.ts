import { context } from '../../core/context';
import { handleAxiosError } from '../../core/handleError';
import { http, updateToken } from '../../core/http';

export const firebaseRegister = async () => {
  try {
    const signUpUrl = `${context.firebaseUrl}/accounts:signUp?key=${context.firebaseApiKey}`;
    const res = await http.post(signUpUrl, {
      email: context.email,
      password: context.password,
      returnSecureToken: true,
    });

    const token = res.data.idToken;
    context.token = token;
    updateToken();

    console.log(`✅ SUCCESS : Signed up to Firebase`);
  } catch (error) {
    handleAxiosError(error);

    console.error('❌ ERROR : Failed to sign up to Firebase', error);
  }
};
