import { gun, type UserSpace } from '@app/lib/gun';
import { useEffect } from 'react';
import { create as createStore } from 'zustand';

/**
 * Authentication state hook.
 *
 * @param onAuthChanges Callback to be called when the user's authentication state changes.
 */
export function useAuthentication(onAuthChanges?: (user: AppUser | null) => void) {
  const { isLoading, user } = useAuthenticationState();

  // Subscribe to changes in the user's authentication state.
  useEffect(() => {
    const unsubscribe = gun?.()
      .user()
      .authChanges((u) => {
        onAuthChanges?.(u);
        useAuthenticationState.setState({ isLoading: false, user: u });
      });

    return unsubscribe;
  }, []);

  // Sign in function.
  const signin = async (credential: AppSinginCredentials) => {
    const { username, password } = credential;
    const user = await gun?.().user().auth(username, password);
    return user;
  };

  return {
    /** State to validate if any process is in progress. */
    isLoading,
    /** Current authenticated user (If null it means the user is not authenticated). */
    user,
    /** Helper to validate simpler the if the user is authenticated. */
    is: !!user,
    /** Sign in function. */
    signin: async (credential: AppSinginCredentials) => {
      useAuthenticationState.setState({ isLoading: true });
      const user = await signin(credential).catch(() => {
        useAuthenticationState.setState({ isLoading: false });
      });
      return user;
    },
    /** Sign up function (If user signups successfully it also signs in). */
    signup: async (credential: AppSignupCredentials) => {
      const { username, password, ...metaData } = credential;

      useAuthenticationState.setState({ isLoading: true });
      const createdUser = await gun?.()
        .user()
        .create(username, password, {
          ...metaData,
          imageUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`,
        })
        .catch(() => {
          useAuthenticationState.setState({ isLoading: false });
        });

      return createdUser;
    },
    /** Sign out function. */
    signout: async () => {
      useAuthenticationState.setState({ isLoading: true });
      await gun?.()
        .user()
        .leave()
        .catch(() => {
          useAuthenticationState.setState({ isLoading: false });
        });
    },
  };
}

/**
 * Authentication state.
 */
type AuthenticationState = {
  user: null | AppUser;
  isLoading: boolean;
};

/**
 * Authentication state store.
 */
const useAuthenticationState = createStore<AuthenticationState>(() => ({
  // The user is updated in the `authChanges` callback.
  user: null,
  isLoading: true,
}));

/**
 * App user type.
 */
export type AppUser = UserSpace['root'];

/**
 * App signin credentials type.
 */
export type AppSinginCredentials = {
  username: string;
  password: string;
};

/**
 * App signup credentials type.
 */
export type AppSignupCredentials = {
  username: string;
  password: string;
  email: string;
};
