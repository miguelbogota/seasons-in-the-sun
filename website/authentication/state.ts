import { useDB } from '@app/db';
import { useEffect } from 'react';
import { create as createStore } from 'zustand';

type User = {
  username: string;
  email: string;
  imageUrl?: string;
};

type AuthenticationState = {
  is: boolean;
  user: null | User;
  isLoading: boolean;
  set: (state: Partial<Omit<AuthenticationState, 'set'>>) => void;
};

const useAuthenticationState = createStore<AuthenticationState>((set) => ({
  is: false,
  user: null,
  isLoading: true,
  set: (state) => set({ ...state, is: !!state.user }),
}));

export function useAuthentication(onAuthChanges?: (user: AuthenticationState['user']) => void) {
  const { is, user: storeUser, isLoading, set: setStore } = useAuthenticationState();
  const { user, gun } = useDB();

  useEffect(() => {
    if (!user()?.is) {
      setStore({ isLoading: false });
    }

    gun()?.on('auth', async () => {
      const profile = (await user()?.get('profile')) as unknown as {
        username: string;
        email: string;
        imageUrl?: string;
      };

      setStore({ isLoading: false, user: profile });
    });
  }, []);

  useEffect(() => {
    onAuthChanges?.(storeUser);
  }, [storeUser]);

  const signin = (credentials: { username: string; password: string }) => {
    const { username, password } = credentials;
    setStore({ isLoading: true });

    return new Promise<User>((resolve, reject) => {
      user()?.auth(username, password, async (data) => {
        if ('err' in data) {
          reject(data.err);
          setStore({ isLoading: false, user: null });
          return;
        }
        const profile = (await user()?.get('profile')) as unknown as User;
        setStore({ isLoading: false, user: profile });
        resolve(profile);
      });
    });
  };

  return {
    is,
    user: storeUser,
    isLoading,
    signin,
    signout: () => {
      user()?.leave();
      setStore({ user: null });
    },
    signup: (credentials: { username: string; password: string; email: string }) => {
      const { username, password, email } = credentials;
      setStore({ isLoading: true });

      return new Promise<User>((resolve, reject) => {
        user()?.create(username, password, async (data) => {
          if ('err' in data) {
            reject(data.err);
            setStore({ isLoading: false, user: null });
            return;
          }

          user()?.auth(username, password, async (data) => {
            if ('err' in data) {
              reject(data.err);
              setStore({ isLoading: false, user: null });
              return;
            }

            const userProfile = {
              username,
              email,
              imageUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`,
            };

            user()
              ?.get('profile')
              .put(userProfile, async () => {
                setStore({ isLoading: false, user: userProfile });
                resolve(userProfile);
              });
          });
        });
      });
    },
  };
}
