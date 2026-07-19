import { signInWithEmail } from "@/app/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
          RV Sales Mission Control
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Sign in</h1>
        <p className="mt-2 text-sm text-slate-500">
          Access your dealership dashboard with your email and password.
        </p>

        <form action={signInWithEmail} className="mt-8 space-y-4">
          <label className="block space-y-2 text-sm text-slate-700">
            <span>Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
              placeholder="you@dealership.com"
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-700">
            <span>Password</span>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
