import { context } from '../../core/context';
import { handleAxiosError } from '../../core/handleError';
import { http, updateToken } from '../../core/http';

export const firebaseRefreshToken = async () => {
  try {
    const refreshTokenUrl = `${context.firebaseUrl}/accounts:signInWithPassword?key=${context.firebaseApiKey}`;
    const res = await http.post(refreshTokenUrl, {
      refreshToken: context.token,
      returnSecureToken: true,
    });

    const token = res.data.idToken;
    context.token = token;
    updateToken();

    console.log(`✅ SUCCESS : Fetched new auth token`);
  } catch (error) {
    handleAxiosError(error);

    console.error('❌ ERROR : Failed to fetch new auth token', error);
  }
};
