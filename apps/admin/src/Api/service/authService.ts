import { apiService } from '@/Api/apiService';
import apiRoutes from '../routes/routes';
import type { SignInResponseDto } from '@/types/auth/SignInResponseDto';
import type { SignUpResponseDto } from '@/types/auth/SignUpResponseDto';
import type { FirebaseSignInRequestDto } from '@/types/auth/SignInRequestDto';
import type { ApiResponse } from '../../types/api/ApiResponse';
import type { FirebaseSignUpRequestSchema } from '@/types/auth/SignUpRequestDto';
import type { User } from '@/types/user/user';

export interface IauthService {
  signIn: (payload: FirebaseSignInRequestDto) => Promise<ApiResponse<SignInResponseDto>>;

  signUp: (payload: FirebaseSignUpRequestSchema) => Promise<ApiResponse<SignUpResponseDto>>;

  oAuthSignIn: (payload: FirebaseSignInRequestDto) => Promise<ApiResponse<SignInResponseDto>>;

  me: () => Promise<ApiResponse<User>>;
}

export const authService: IauthService = {
  signIn: (payload) => {
    return apiService.post<SignInResponseDto>(apiRoutes.auth.signIn(), payload);
  },
  signUp: (payload) => {
    return apiService.post<SignUpResponseDto>(apiRoutes.auth.signUp(), payload);
  },
  oAuthSignIn: (payload) => {
    return apiService.post<SignInResponseDto>(apiRoutes.auth.oAuthSignIn(), payload);
  },
  me: () => {
    return apiService.get(apiRoutes.auth.me());
  },
};
