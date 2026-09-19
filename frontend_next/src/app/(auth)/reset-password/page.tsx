import { Suspense } from 'react';
import { ResetPasswordForm } from '@/modules/auth/ui/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={<p>Chargement...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}