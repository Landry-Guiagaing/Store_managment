'use client';

import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useLogin } from '../application/useLogin';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

interface FormData {
  username: string;
  password: string;
}

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useLogin();

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nom d'utilisateur"
        {...register('username', { required: "Nom d'utilisateur requis" })}
        error={errors.username?.message}
        autoComplete="username"
      />

      <Input
        type="password"
        label="Mot de passe"
        {...register('password', { required: 'Mot de passe requis' })}
        error={errors.password?.message}
        autoComplete="current-password"
      />

      {loginMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">
            {(loginMutation.error as { message?: string })?.message ??
              'Erreur de connexion'}
          </p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Connexion...' : 'Se connecter'}
      </Button>

      <Link
        href="/forgot-password"
        className="block text-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
      >
        Mot de passe oublié ?
      </Link>
    </form>
  );
}