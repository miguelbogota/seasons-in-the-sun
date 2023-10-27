import { type IGunInstance, type IGunUserInstance } from 'gun';
import { useEffect, useState } from 'react';

export function useDB() {
  const [db, setDb] = useState<IGunInstance | null>(null);
  const [user, setUser] = useState<IGunUserInstance | null>(null);

  useEffect(() => {
    const gun = GUN();
    setDb(gun);
    setUser(gun.user().recall({ sessionStorage: true }));
  }, []);

  return { db, user };
}
