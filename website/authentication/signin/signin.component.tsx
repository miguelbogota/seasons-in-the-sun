import { TextField } from '@app/ui/text-field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { type AppSigninCredentials, appSigninCredentialsSchema, useAuthentication } from '../state';

export function Signin() {
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
    <div className="signin">
      <h2>Welcome Back</h2>
      <form onSubmit={onSubmit}>
        <TextField
          {...register('username')}
          label="Username"
          placeholder="Ex. johndoe"
          hint={errors.username?.message}
        />

        <TextField
          {...register('password')}
          label="Password"
          type="password"
          hint={errors.password?.message}
        />

        <button className="button" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
