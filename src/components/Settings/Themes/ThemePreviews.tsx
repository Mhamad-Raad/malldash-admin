// Theme preview components - Dashboard-like layout with sidebar and content
export const LightPreview = () => (
  <div className='bg-gray-100 flex h-24'>
    {/* Sidebar */}
    <div className='w-10 bg-white border-r border-gray-200 p-1.5 flex flex-col gap-1.5'>
      <div className='w-full h-3 rounded bg-gray-200' />
      <div className='w-full h-2 rounded bg-gray-100' />
      <div className='w-full h-2 rounded bg-gray-100' />
      <div className='w-full h-2 rounded bg-gray-100' />
      <div className='w-full h-2 rounded bg-gray-100' />
    </div>
    {/* Main content */}
    <div className='flex-1 p-2 space-y-2'>
      {/* Header bar */}
      <div className='flex items-center justify-between'>
        <div className='h-2 bg-gray-300 rounded w-16' />
        <div className='flex gap-1'>
          <div className='w-3 h-3 rounded-full bg-gray-200' />
          <div className='w-3 h-3 rounded-full bg-gray-200' />
        </div>
      </div>
      {/* Cards row */}
      <div className='grid grid-cols-3 gap-1.5'>
        <div className='h-10 rounded bg-white border border-gray-200 p-1.5'>
          <div className='h-1.5 bg-gray-200 rounded w-2/3 mb-1' />
          <div className='h-3 bg-black rounded w-1/2' />
        </div>
        <div className='h-10 rounded bg-white border border-gray-200 p-1.5'>
          <div className='h-1.5 bg-gray-200 rounded w-2/3 mb-1' />
          <div className='h-3 bg-gray-300 rounded w-1/2' />
        </div>
        <div className='h-10 rounded bg-white border border-gray-200 p-1.5'>
          <div className='h-1.5 bg-gray-200 rounded w-2/3 mb-1' />
          <div className='h-3 bg-gray-300 rounded w-1/2' />
        </div>
      </div>
    </div>
  </div>
);

export const DarkPreview = () => (
  <div className='bg-zinc-950 flex h-24'>
    {/* Sidebar */}
    <div className='w-10 bg-zinc-900 border-r border-zinc-800 p-1.5 flex flex-col gap-1.5'>
      <div className='w-full h-3 rounded bg-zinc-700' />
      <div className='w-full h-2 rounded bg-zinc-800' />
      <div className='w-full h-2 rounded bg-zinc-800' />
      <div className='w-full h-2 rounded bg-zinc-800' />
      <div className='w-full h-2 rounded bg-zinc-800' />
    </div>
    {/* Main content */}
    <div className='flex-1 p-2 space-y-2'>
      {/* Header bar */}
      <div className='flex items-center justify-between'>
        <div className='h-2 bg-zinc-600 rounded w-16' />
        <div className='flex gap-1'>
          <div className='w-3 h-3 rounded-full bg-zinc-700' />
          <div className='w-3 h-3 rounded-full bg-zinc-700' />
        </div>
      </div>
      {/* Cards row */}
      <div className='grid grid-cols-3 gap-1.5'>
        <div className='h-10 rounded bg-zinc-900 border border-zinc-700 p-1.5'>
          <div className='h-1.5 bg-zinc-700 rounded w-2/3 mb-1' />
          <div className='h-3 bg-white rounded w-1/2' />
        </div>
        <div className='h-10 rounded bg-zinc-900 border border-zinc-700 p-1.5'>
          <div className='h-1.5 bg-zinc-700 rounded w-2/3 mb-1' />
          <div className='h-3 bg-zinc-600 rounded w-1/2' />
        </div>
        <div className='h-10 rounded bg-zinc-900 border border-zinc-700 p-1.5'>
          <div className='h-1.5 bg-zinc-700 rounded w-2/3 mb-1' />
          <div className='h-3 bg-zinc-600 rounded w-1/2' />
        </div>
      </div>
    </div>
  </div>
);

export const SystemPreview = () => (
  <div className='grid grid-cols-2 overflow-hidden h-24'>
    {/* Light half with sidebar */}
    <div className='bg-gray-100 flex'>
      <div className='w-6 bg-white border-r border-gray-200 p-1 flex flex-col gap-1'>
        <div className='w-full h-2 rounded bg-gray-200' />
        <div className='w-full h-1.5 rounded bg-gray-100' />
        <div className='w-full h-1.5 rounded bg-gray-100' />
        <div className='w-full h-1.5 rounded bg-gray-100' />
      </div>
      <div className='flex-1 p-1.5 space-y-1'>
        <div className='h-1.5 bg-gray-300 rounded w-10' />
        <div className='h-8 rounded bg-white border border-gray-200 p-1'>
          <div className='h-1 bg-gray-200 rounded w-2/3 mb-0.5' />
          <div className='h-2 bg-black rounded w-1/2' />
        </div>
      </div>
    </div>
    {/* Dark half with sidebar */}
    <div className='bg-zinc-950 flex'>
      <div className='w-6 bg-zinc-900 border-r border-zinc-800 p-1 flex flex-col gap-1'>
        <div className='w-full h-2 rounded bg-zinc-700' />
        <div className='w-full h-1.5 rounded bg-zinc-800' />
        <div className='w-full h-1.5 rounded bg-zinc-800' />
        <div className='w-full h-1.5 rounded bg-zinc-800' />
      </div>
      <div className='flex-1 p-1.5 space-y-1'>
        <div className='h-1.5 bg-zinc-600 rounded w-10' />
        <div className='h-8 rounded bg-zinc-900 border border-zinc-700 p-1'>
          <div className='h-1 bg-zinc-700 rounded w-2/3 mb-0.5' />
          <div className='h-2 bg-white rounded w-1/2' />
        </div>
      </div>
    </div>
  </div>
);
