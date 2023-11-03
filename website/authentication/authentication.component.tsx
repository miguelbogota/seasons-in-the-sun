import { TextField } from '@app/ui/text-field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import * as styles from './authentication.css';
import {
  type AppSigninCredentials,
  appSigninCredentialsSchema,
  type AppSignupCredentials,
  appSignupCredentialsSchema,
  useAuthentication,
} from './state';

export function Authentication() {
  const { isLoading, user, signout } = useAuthentication();

  return isLoading ? (
    'loading...'
  ) : (
    <div className={styles.root}>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      {user ? (
        <>
          <button onClick={signout}>Sign out</button>
        </>
      ) : (
        <>
          <Signin />
          <br />
          <div>--------------------------------------------</div>
          <br />
          <Signup />
        </>
      )}
    </div>
  );
}

function Signin() {
  const { signin } = useAuthentication();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppSigninCredentials>({
    criteriaMode: 'all',
    resolver: zodResolver(appSigninCredentialsSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    await signin(data).catch(console.error);
  });

  return (
    <div>
      <h2>Welcome Back</h2>
      <form onSubmit={onSubmit}>
        <TextField
          {...register('username')}
          label="Username"
          placeholder="Ex. johndoe"
          hint={errors.username?.message}
        />

        <TextField {...register('password')} label="Password" hint={errors.password?.message} />

        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}

function Signup() {
  const { signup } = useAuthentication();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppSignupCredentials>({
    criteriaMode: 'all',
    resolver: zodResolver(appSignupCredentialsSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    await signup(data).catch(console.error);
  });

  return (
    <div>
      <h2>Join</h2>
      <form onSubmit={onSubmit}>
        <TextField
          {...register('username')}
          label="Username"
          placeholder="Ex. johndoe"
          hint={errors.username?.message}
        />

        <TextField {...register('password')} label="Password" />
        {errors?.password?.types &&
          Object.entries(errors.password.types).map(([type, message]) =>
            Array.isArray(message) ? (
              message.map((message) => (
                <>
                  <p key={type}>{message}</p>
                  <br />
                </>
              ))
            ) : (
              <>
                <p key={type}>{message}</p>
                <br />
              </>
            ),
          )}

        <TextField
          {...register('confirmPassword')}
          label="Confirm Password"
          hint={errors.confirmPassword?.message}
        />

        <TextField
          {...register('email')}
          label="Email"
          placeholder="Ex. johndoe@email.com"
          hint={errors.email?.message}
        />

        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
