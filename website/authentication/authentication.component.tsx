// import { type ChangeEventHandler, type FormEvent, type MouseEventHandler, useState } from 'react';

// import * as styles from './authentication.css';
// import { useAuthentication } from './state';

// /**
//  * Small authentication menu with the option to sign in/up/out.
//  */
// export function Authentication() {
//   const [showMenu, setShowMenu] = useState(false);

//   const { user, isLoading } = useAuthentication();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   const authMenu = <AuthenticationMenu closeMenu={() => setShowMenu(false)} />;

//   return user ? (
//     <div className={styles.root}>
//       <AvatarButton
//         username={user?.username}
//         imageUrl={user?.imageUrl}
//         onClick={() => setShowMenu(!showMenu)}
//       />
//       {showMenu && authMenu}
//     </div>
//   ) : (
//     authMenu
//   );
// }

// type AvatarButtonProps = {
//   imageUrl?: string;
//   username: string;
//   onClick?: MouseEventHandler<HTMLButtonElement>;
// };

// function AvatarButton(props: AvatarButtonProps) {
//   const { imageUrl, username, onClick } = props;

//   return (
//     <button onClick={onClick}>
//       <span>@{username}</span>
//       {imageUrl && <img src={imageUrl} alt={`${username} avatar image`} />}
//     </button>
//   );
// }

// function AuthenticationMenu(props: { closeMenu: () => void }) {
//   const { closeMenu } = props;

//   const { is, signin, signup, signout } = useAuthentication();
//   const [data, setData] = useState({
//     username: '',
//     password: '',
//     'confirm-password': '',
//     email: '',
//   });

//   const updateData: ChangeEventHandler<HTMLInputElement> = (e) => {
//     setData({
//       ...data,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const onLogin = async () => {
//     await signin({
//       username: 'miguel',
//       password: '12345miguel',
//     });
//   };

//   const onLogout = () => {
//     signout();
//     closeMenu();
//   };

//   const onSignup = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     await signup({
//       username: data.username,
//       password: data.password,
//       email: data.email,
//     });

//     closeMenu();
//   };

//   return (
//     <div>
//       {is ? (
//         <button onClick={onLogout}>Logout</button>
//       ) : (
//         <>
//           <button onClick={onLogin}>Login</button>

//           <form onSubmit={onSignup}>
//             <h3>Sign up</h3>

//             <label htmlFor="username">Username</label>
//             <input type="text" id="username" name="username" onChange={updateData} />

//             <label htmlFor="password">Password</label>
//             <input type="password" id="password" name="password" onChange={updateData} />

//             <label htmlFor="confirm-password">Confirm password</label>
//             <input
//               type="password"
//               id="confirm-password"
//               name="confirm-password"
//               onChange={updateData}
//             />

//             <label htmlFor="email">Email</label>
//             <input type="email" id="email" name="email" onChange={updateData} />

//             <button type="submit">Sign up</button>
//           </form>
//         </>
//       )}
//     </div>
//   );
// }
import { type DbSchema, gun } from '@app/lib/gun';
import { useEffect, useState } from 'react';

import * as styles from './authentication.css';

export function Authentication() {
  const [user, setUser] = useState<null | DbSchema['user']['root']>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const d = gun?.()
      .user()
      .authChanges((u) => {
        setUser(u);
        setIsLoading(false);
      });
    return () => d?.();
  }, []);

  return isLoading ? (
    'loading...'
  ) : (
    <div className={styles.root}>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      {user ? (
        <button
          onClick={() => {
            setIsLoading(true);
            gun?.()
              .user()
              .leave()
              .then(() => {
                setIsLoading(false);
              });
          }}
        >
          logout
        </button>
      ) : (
        <button
          onClick={() => {
            setIsLoading(true);
            gun?.()
              .user()
              .auth('miguel', '12345miguel')
              .then(() => {
                setIsLoading(false);
              });
          }}
        >
          login
        </button>
      )}
    </div>
  );
}
