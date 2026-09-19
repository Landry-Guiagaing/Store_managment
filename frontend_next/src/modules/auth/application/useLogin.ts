'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authRepository } from '../infrastructure/HttpAuthRepository';
import { useAuthStore } from './useAuthStore';
import type { Credentials } from '../domain/User';

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (credentials: Credentials) =>
      authRepository.login(credentials),
    onSuccess: (data) => {
      setAuth(
        {
          id: data.id,
          username: data.username,
          nome: data.nome,
          email: data.email,
          role: data.role,
        },
        data.token
      );
      router.push('/dashboard');
    },
  });
}