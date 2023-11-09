import { Spinner } from '@app/ui/spinner';
import { TabGroup } from '@app/ui/tabs';
import { useState } from 'react';

import { Signin } from './signin';
import { Signup } from './signup';
import { useAuthentication } from './state';

export function Authentication() {
  const { isLoading, user } = useAuthentication();

  return (
    <div className="authentication">
      {isLoading && <Spinner />}
      {!isLoading && !user && <UnauthenticatedMenu />}
      {!isLoading && user && <AuthenticatedMenu />}
    </div>
  );
}

function UnauthenticatedMenu() {
  const [value, setValue] = useState<'signin' | 'signup'>('signin');

  return (
    <TabGroup
      value={value}
      onChange={setValue}
      className="unauthenticated-menu"
      panels={[
        {
          value: 'signin',
          label: '👋 Sign in',
          content: <Signin />,
        },
        {
          value: 'signup',
          label: '🤘 Sign up',
          content: <Signup />,
        },
      ]}
    />
  );
}

function AuthenticatedMenu() {
  const { user, signout } = useAuthentication();
  const [showMenu, setShowMenu] = useState(false);

  return (
    user && (
      <div className="authenticated-menu">
        <button className="user-icon" onClick={() => setShowMenu((prev) => !prev)}>
          <img src={user.imageUrl} alt={`${user.username} profile image`} />
        </button>
        {showMenu && (
          <div className="dropdown-menu">
            <h4>Hey there @{user.username}!</h4>
            <p>{user.email}</p>
            <button className="button" onClick={signout}>
              Sign out
            </button>
          </div>
        )}
      </div>
    )
  );
}
