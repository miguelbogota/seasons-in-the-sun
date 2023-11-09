import 'react';

declare module 'react' {
  // This augmentation is needed because React.forwardRef does not support generic components.
  function forwardRef<T, P = object>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}
