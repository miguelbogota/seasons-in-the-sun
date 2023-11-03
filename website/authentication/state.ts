import { gun, type UserSpace } from '@app/lib/gun';
import { useEffect } from 'react';
import { z } from 'zod';
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
  const signin = async (credential: AppSigninCredentials) => {
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
    signin: async (credential: AppSigninCredentials) => {
      const validation = await appSigninCredentialsSchema.safeParseAsync(credential);

      if (!validation.success) {
        throw validation.error.errors;
      }

      useAuthenticationState.setState({ isLoading: true });
      const user = await signin(credential).catch(() => {
        useAuthenticationState.setState({ isLoading: false });
      });
      return user;
    },
    /** Sign up function (If user signups successfully it also signs in). */
    signup: async (credential: AppSignupCredentials) => {
      const { username, password, confirmPassword: _, ...metaData } = credential;

      const validation = await appSignupCredentialsSchema.safeParseAsync(credential);

      if (!validation.success) {
        throw validation.error.errors;
      }

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
 * Sign in credentials validation schema. No need to validate a lot the fields since it should be
 * already validated when the user was created
 */
export const appSigninCredentialsSchema = z.object({
  username: z
    .string({
      description: 'Username',
      required_error: 'Username is required',
    })
    .min(10, 'Username must be at least 10 characters')
    .max(30, 'Username must be at most 30 characters'),
  password: z
    .string({
      description: 'Password',
      required_error: 'Password is required',
    })
    .min(10, 'Password must be at least 10 characters')
    .max(30, 'Password must be at most 30 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
});

/**
 * Sign in credentials type.
 */
export type AppSigninCredentials = z.infer<typeof appSigninCredentialsSchema>;

export const appSignupCredentialsSchema = z
  .object({
    username: z
      .string({
        description: 'Username',
        required_error: 'Username is required',
      })
      .min(10, 'Username must be at least 10 characters')
      .max(30, 'Username must be at most 30 characters'),
    password: z
      .string({
        description: 'Password',
        required_error: 'Password is required',
      })
      .min(10, 'Password must be at least 10 characters')
      .max(30, 'Password must be at most 30 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string({
      description: 'Confirm password',
      required_error: 'Confirm password is required',
    }),
    email: z
      .string({
        description: 'Email',
      })
      .email('Email must be a valid email'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type AppSignupCredentials = z.infer<typeof appSignupCredentialsSchema>;
