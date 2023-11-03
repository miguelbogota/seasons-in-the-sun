import { type ColorOption } from '@app/styles';
import clsx from 'clsx';
import { type ComponentPropsWithoutRef, forwardRef, type Ref, useId } from 'react';

/** Props for the TextField component. */
export type TextFieldProps = BaseProps & OmitProps;
type OmitProps = Omit<ComponentPropsWithoutRef<'input'>, keyof BaseProps>;
type BaseProps = {
  label?: string;
  hint?: string;
  color?: ColorOption;
  children?: never;
};

export const TextField = forwardRef(function TextField(
  inProps: TextFieldProps,
  ref: Ref<HTMLInputElement>,
) {
  const { className, label, hint, color, id: propsId, placeholder = '', ...props } = inProps;

  const defaultId = useId();

  const id = propsId ?? defaultId;
  const rootClassName = clsx('text-field', className, {
    [`is-${color}`]: color,
  });

  return (
    <div className={rootClassName}>
      <input {...props} id={id} ref={ref} placeholder={placeholder} type="text" />
      {label && <label htmlFor={id}>{label}</label>}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
});
