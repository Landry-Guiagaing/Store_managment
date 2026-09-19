'use client';

import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useForgotPassword } from '../application/useForgotPassword';

interface FormData {
  email: string;
}

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const mutation = useForgotPassword();

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  if (mutation.isSuccess) {
    return (
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
        <h1 className="text-xl font-bold mb-4">Email envoyé</h1>
        <p className="text-sm text-gray-600 mb-4">
          {mutation.data?.message ??
            'Un email de réinitialisation a été envoyé si le compte existe.'}
        </p>

        {mutation.data?.devResetLink && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-4 text-left">
            <p className="text-xs text-yellow-800 mb-2 font-semibold">
              Mode dev — lien direct :
            </p>
            <Link
              href={mutation.data.devResetLink}
              className="text-blue-600 text-sm break-all hover:underline"
            >
              {mutation.data.devResetLink}
            </Link>
          </div>
        )}

        {!mutation.data?.devResetLink && mutation.data?.devToken && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-4 text-left">
            <p className="text-xs text-yellow-800 mb-2 font-semibold">
              Mode dev — token :
            </p>
            <Link
              href={`/reset-password?token=${mutation.data.devToken}`}
              className="text-blue-600 text-sm break-all hover:underline"
            >
              Réinitialiser maintenant
            </Link>
          </div>
        )}

        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
    >
      <h1 className="text-xl font-bold text-center">Mot de passe oublié</h1>
      <p className="text-sm text-gray-600 text-center">
        Saisis ton email pour recevoir un lien de réinitialisation.
      </p>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Email requis',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Email invalide',
            },
          })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {mutation.isError && (
        <p className="text-red-500 text-sm">
          {(mutation.error as { message?: string })?.message ??
            'Erreur lors de la demande'}
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
      >
        {mutation.isPending ? 'Envoi...' : 'Envoyer le lien'}
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