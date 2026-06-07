import { ResetPasswordForm } from "@/src/components/reset-password-form";
import { SiteHeader } from "@/src/components/site-header";

export default function AuthResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-6">
        <SiteHeader />

        <div className="flex min-h-[calc(100vh-24rem)] items-center justify-center py-8">
          <ResetPasswordForm />
        </div>
      </section>
    </main>
  );
}
