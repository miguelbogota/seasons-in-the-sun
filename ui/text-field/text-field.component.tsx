import { type ThemeFullColorOption } from '@app/theme';
import clsx from 'clsx';
import { type ComponentPropsWithoutRef, forwardRef, type Ref, useId } from 'react';

import * as styles from './text-field.css';

/** Props for the TextField component. */
export type TextFieldProps = BaseProps & OmitProps;
type OmitProps = Omit<ComponentPropsWithoutRef<'input'>, keyof BaseProps>;
type BaseProps = {
  label?: string;
  hint?: string;
  color?: ThemeFullColorOption;
  children?: never;
};

export const TextField = forwardRef(function TextField(
  inProps: TextFieldProps,
  ref: Ref<HTMLInputElement>,
) {
  const { className, label, hint, color, id: propsId, placeholder = '', ...props } = inProps;

  const defaultId = useId();

  const id = propsId ?? defaultId;
  const rootClassName = clsx(styles.root, className, {
    [`is-${color}`]: color,
  });

  return (
    <div className={rootClassName}>
      <input {...props} id={id} className={styles.input} ref={ref} placeholder={placeholder} />
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
});
