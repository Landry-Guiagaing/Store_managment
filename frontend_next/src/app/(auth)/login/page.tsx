import { LoginForm } from '@/modules/auth/ui/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            <span className="text-orange-600">Es</span>toque
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Connectez-vous à votre espace
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}