import { spinnerStyles } from './spinner.css';

export function Spinner() {
  return (
    <svg className={spinnerStyles.spinner} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle className={spinnerStyles.circle} cx="50" cy="50" r="45" />
    </svg>
  );
}
