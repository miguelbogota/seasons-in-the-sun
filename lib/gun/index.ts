// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// *************************************************** //
// ******************** IMPORTANT ******************** //
// *************************************************** //
// ****** THIS FILE DOES NOT HAVE TYPE CHECKING ****** //
// ****** ENABLED SINCE GUN.JS HAS AWFUL TYPING ****** //
// *************************************************** //
// ************* BE CAREFUL WHEN EDITING ************* //
// *************************************************** //

import { type IGunChain, type IGunUserInstance } from 'gun';
import { omit } from 'lodash';
import { createStore } from 'zustand/vanilla';

/**
 * Gun.js wrapper to provide a more convenient API.
 */
export const gun = typeof window === 'undefined' ? null : gunImpl;

/**
 * Gun.js wrapper implementation.
 */
function gunImpl() {
  // Creates initial global instance of Gun.js.
  if (!global.__gunInstance) {
    global.__gunInstance = GUN();
  }

  const gunInstance = global.__gunInstance;

  return {
    /**
     * Returns a reference to the public space.
     */
    public<const TPath extends PublicSpacePaths>(pathRef: TPath) {
      const path = pathRef.split('.');

      // Gun.js uses chaining to access nested properties.
      // This transforms the path into a chain of calls.
      const instance = path.reduce(
        (currentInstance, path) => currentInstance.get(path),
        gunInstance,
      ) as IGunChain<DbSchema>;

      return {
        /**
         * Returns a promise that resolves to the value at the given path.
         */
        get(): Promise<PathMatcher<PublicSpace, TPath> | null | undefined> {
          return new Promise((resolve) => instance.once((data) => resolve(data)));
        },
        /**
         * Sets the value at the given path.
         */
        set(data: Partial<PathMatcher<PublicSpace, TPath>>): Promise<void> {
          return new Promise((resolve) =>
            instance.put(data, (data) => (data.err ? reject(data.err) : resolve())),
          );
        },
        /**
         * Subscribes to changes at the given path.
         */
        changes(callback: (value: PathMatcher<PublicSpace, TPath>) => void): () => void {
          instance.on((_data) => {
            const data = omit(_data, '_');
            callback(data);
          });
          return () => instance.off();
        },
      };
    },
    user() {
      const userInstance: IGunUserInstance = gunInstance.user().recall({ sessionStorage: true });

      // If the user is already authenticated but the state is not updated, this will update it.
      if (userInstance.is && authStore.getState().user === null) {
        userInstance.get('root').once((user) => {
          const _user = omit(user, '_');
          authStore.setState({ user: _user });
        });
      }

      return {
        /**
         * Returns a reference to the user space.
         */
        ref<const TPath extends UserSpacePaths>(pathRef: TPath) {
          const path = pathRef.split('.');

          // Gun.js uses chaining to access nested properties in the user space as well.
          // This transforms the path into a chain of calls.
          const instance = path.reduce(
            (currentInstance, path) => currentInstance.get(path),
            userInstance,
          ) as IGunChain<DbSchema>;

          return {
            /**
             * Returns a promise that resolves to the value at the given path.
             */
            get(): Promise<PathMatcher<UserSpace, TPath> | null | undefined> {
              return new Promise((resolve) => instance.once((data) => resolve(data)));
            },
            /**
             * Sets the value at the given path.
             */
            set(data: Partial<PathMatcher<UserSpace, TPath>>): Promise<void> {
              return new Promise((resolve) =>
                instance.put(data, (data) => (data.err ? reject(data.err) : resolve())),
              );
            },
            /**
             * Subscribes to changes at the given path.
             */
            changes(callback: (value: PathMatcher<UserSpace, TPath>) => void): () => void {
              instance.on((_data) => {
                const data = omit(_data, '_');
                callback(data);
              });
              return () => instance.off();
            },
          };
        },
        /**
         * Authenticates the user.
         */
        auth(username: string, password: string): Promise<UserSpace['root']> {
          return new Promise<void>((resolve, reject) =>
            userInstance.auth(username, password, (data) => {
              if ('err' in data) {
                reject(data.err);
                return;
              }

              userInstance.get('root').once((user) => {
                const _user = omit(user, '_');
                authStore.setState({ user: _user });
                resolve(_user);
              });
            }),
          );
        },
        /**
         * Creates a new user.
         */
        create(
          username: string,
          password: string,
          additionalData: Omit<UserSpace['root'], 'username'>,
        ): Promise<UserSpace['root']> {
          return new Promise<void>((resolve, reject) =>
            userInstance.create(username, password, (data) => {
              if ('err' in data) {
                reject(data.err);
                return;
              }

              // If user creation was successful, authenticate the user.
              userInstance.auth(username, password, (data) => {
                if ('err' in data) {
                  reject(data.err);
                  return;
                }

                // If authentication was successful, add additional data to the user's root.
                userInstance.get('root').put({ ...additionalData, username }, (data) => {
                  if (data.err) {
                    reject(data.err);
                    return;
                  }

                  // If additional data was added successfully, return the user's data.
                  userInstance.get('root').once((user) => {
                    const _user = omit(user, '_');
                    authStore.setState({ user: _user });
                    resolve(_user);
                  });
                });
              });
            }),
          );
        },
        /**
         * Returns if the user is authenticated or not.
         */
        get is() {
          return userInstance.is;
        },
        /**
         * Signs out the current user.
         */
        leave() {
          return new Promise<void>((resolve) =>
            setTimeout(() => {
              userInstance.leave();
              authStore.setState({ user: null });
              // Check if logout failed, if so manually remove user from session storage.
              // See https://gun.eco/docs/User#user-leave
              if (userInstance._.sea) {
                window.sessionStorage.removeItem('pair');
              }
              resolve();
            }, 350),
          );
        },
        /**
         * Subscribes to changes in the user's authentication state.
         */
        authChanges(callback: (value: UserSpace['root']) => void): () => void {
          // If user is not authenticated it won't trigger the callback the first time.
          // This ensures the callback is called at least once regardless of the user's auth state.
          if (!userInstance.is) {
            callback(null);
          }
          const unsubscribe = authStore.subscribe((state) => {
            callback(state.user);
          });
          return unsubscribe;
        },
      };
    },
  };
}

/**
 * Auth store to keep track of the current user state.
 */
const authStore = createStore<{ user: UserSpace['root'] | null }>(() => ({ user: null }));

/**
 * All possible paths in the user space.
 */
export type UserSpacePaths = Paths<UserSpace>;
/**
 * Helper type with the user space schema.
 */
export type UserSpace = DbSchema['user'];

/**
 * All possible paths in the public space.
 */
export type PublicSpacePaths = Paths<PublicSpace>;
/**
 * Helper type with the public space schema.
 */
export type PublicSpace = DbSchema['public'];

/**
 * Schema to use in the database (Gun.js).
 */
export type DbSchema = {
  user: {
    root: {
      username: string;
      email: string;
      imageUrl?: string;
    };
  };
  public: {
    root: {
      something: string;
    };
  };
};
