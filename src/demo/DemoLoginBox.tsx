/** Public demo only: the demo account, shown above the sign-in form (see src/demo/server.ts). */
import { DEMO, resetDemo } from './server';

export function DemoLoginBox({ email, password, onFill }: { email: string; password: string; onFill: () => void }) {
  if (!DEMO) return null;
  return (
    <div className='mb-6 rounded-xl border border-border bg-muted/40 p-4 text-sm'>
      <div className='flex items-center justify-between gap-3'>
        <span className='font-semibold'>Demo account</span>
        <button type='button' onClick={onFill} className='rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90'>
          Fill in
        </button>
      </div>
      <dl className='mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1'>
        <dt className='text-muted-foreground'>Email</dt>
        <dd className='font-mono select-all break-all'>{email}</dd>
        <dt className='text-muted-foreground'>Password</dt>
        <dd className='font-mono select-all'>{password}</dd>
      </dl>
      <p className='mt-3 text-xs text-muted-foreground'>
        Made-up data that stays in your browser.{' '}
        <button type='button' onClick={resetDemo} className='underline underline-offset-2'>Reset data</button>
      </p>
    </div>
  );
}
