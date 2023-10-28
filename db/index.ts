import { type IGunInstance, type IGunUserInstance } from 'gun';
import { useEffect, useRef } from 'react';

export function useDB() {
  const gunRef = useRef<IGunInstance>();
  const userRef = useRef<IGunUserInstance>();
  const onAuthRef = useRef<() => Promise<void>>();

  useEffect(() => {
    const gun = GUN();
    const user = gun.user().recall({ sessionStorage: true });

    gunRef.current = gun;
    userRef.current = user;
  }, [onAuthRef]);

  return {
    gun: () => gunRef.current,
    user: () => userRef.current,
  };
}
