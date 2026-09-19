'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useResetPassword } from '../application/useResetPassword';

interface FormData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token') ?? '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { token: tokenFromUrl, newPassword: '', confirmPassword: '' },
  });

  const mutation = useResetPassword();
  const newPassword = watch('newPassword');

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { token: data.token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setTimeout(() => router.push('/login'), 2000);
        },
      }
    );
  };

  if (mutation.isSuccess) {
    return (
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
        <h1 className="text-xl font-bold mb-4 text-green-600">
          Mot de passe réinitialisé
        </h1>
        <p className="text-sm text-gray-600">
          Redirection vers la page de connexion...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
    >
      <h1 className="text-xl font-bold text-center">Nouveau mot de passe</h1>

      <div>
        <label className="block text-sm font-medium mb-1">Token</label>
        <input
          {...register('token', { required: 'Token requis' })}
          className="w-full border rounded px-3 py-2 font-mono text-xs"
          readOnly={!!tokenFromUrl}
        />
        {errors.token && (
          <p className="text-red-500 text-sm mt-1">{errors.token.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
        <input
          type="password"
          {...register('newPassword', {
            required: 'Mot de passe requis',
            minLength: { value: 6, message: 'Minimum 6 caractères' },
          })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirmer</label>
        <input
          type="password"
          {...register('confirmPassword', {
            required: 'Confirmation requise',
            validate: (v) =>
              v === newPassword || 'Les mots de passe ne correspondent pas',
          })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {mutation.isError && (
        <p className="text-red-500 text-sm">
          {(mutation.error as { message?: string })?.message ??
            'Erreur lors de la réinitialisation'}
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
      >
        {mutation.isPending ? 'Réinitialisation...' : 'Réinitialiser'}
      </button>

      <Link
        href="/login"
        className="block text-center text-sm text-blue-600 hover:underline"
      >
        Retour à la connexion
      </Link>
    </form>
  );
}