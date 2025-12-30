import firebaseService from '@/Api/service/firebaseService';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const useLoginWithGoogle = () => {
  const oAuthSignIn = useAuthStore((state) => state.oAuthLogin);
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    const googleLoginResponse = await firebaseService.loginWithGoogle();

    if (googleLoginResponse.success === false) {
      throw new Error('Failed to sign in with Google: ' + JSON.stringify(googleLoginResponse.error, null, 2));
    }
    const idToken = googleLoginResponse.data;

    const signInResponse = await oAuthSignIn({ idToken });

    navigate('/profile');
  };

  return { loginWithGoogle };
};

export default useLoginWithGoogle;
