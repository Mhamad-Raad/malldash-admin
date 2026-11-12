# Sonner Toast Usage Guide

Sonner is now integrated into your application. Here's how to use it:

## Basic Usage

```typescript
import { toast } from 'sonner';

// Success toast
toast.success('User updated successfully!');

// Error toast
toast.error('Something went wrong');

// Info toast
toast.info('New feature available');

// Warning toast
toast.warning('Please review your changes');

// Default toast
toast('This is a message');
```

## Advanced Features

### With Description
```typescript
toast.success('Payment completed', {
  description: 'Your payment of $99.99 was processed successfully',
});
```

### With Action Button
```typescript
toast('Event scheduled', {
  description: 'Meeting at 3:00 PM',
  action: {
    label: 'View',
    onClick: () => console.log('View clicked'),
  },
});
```

### With Custom Duration
```typescript
toast.success('Saved!', {
  duration: 3000, // 3 seconds
});

// Infinite duration
toast.loading('Processing...', {
  duration: Infinity,
});
```

### Promise-based Toasts
```typescript
const promise = () => new Promise((resolve) => setTimeout(resolve, 2000));

toast.promise(promise, {
  loading: 'Loading...',
  success: 'Data loaded successfully',
  error: 'Error loading data',
});
```

### Loading State with Manual Control
```typescript
const toastId = toast.loading('Uploading...');

// Later, update it
toast.success('Upload complete!', { id: toastId });

// Or dismiss
toast.dismiss(toastId);
```

### Custom Styling
```typescript
toast.success('Custom styled toast', {
  className: 'my-custom-class',
  style: {
    background: 'green',
    color: 'white',
  },
});
```

## Examples in Your App

### UserDetail.tsx (Current Usage)
```typescript
// Success
toast.success('User updated successfully!');

// Error
toast.error(errorMessage);
```

### Enhanced Example
```typescript
toast.success('User updated successfully!', {
  description: `${user.firstName} ${user.lastName}'s profile has been updated`,
  action: {
    label: 'Undo',
    onClick: () => handleUndo(),
  },
});
```

## Positioning & Theming

The toaster is configured in `main.tsx` with:
- Automatic dark/light theme support
- Default position: bottom-right
- Custom styling to match your shadcn/ui components