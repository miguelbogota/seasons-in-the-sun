import clsx from 'clsx';
import { motion } from 'framer-motion';
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode, type Ref } from 'react';

/** Props for the TabGroup component. */
export type TabGroupProps<T> = BaseProps<T> & OmitProps<T>;
type OmitProps<T> = Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps<T> | 'children'>;
type BaseProps<T> = {
  value?: T;
  onChange?: (value: T) => void;
  panels: {
    value: string;
    label: ReactNode;
    content: ReactNode;
  }[];
};

/**
 * TabGroup component that renders a group of tabs and a panel for each tab.
 */
export const TabGroup = forwardRef(function TabGroupRoot<T>(
  inProps: TabGroupProps<T>,
  ref: Ref<HTMLDivElement>,
) {
  const { panels, value, onChange, className, ...props } = inProps;

  const rootClassName = clsx('tab-group', className);

  return (
    <div ref={ref} {...props} className={rootClassName}>
      <div role="tablist">
        {panels.map((tab) => {
          const { label, value: tabValue } = tab;

          const isSelected = tabValue === value;
          const tabClassName = clsx('tab', {
            'is-selected': isSelected,
          });

          return (
            <button
              key={tabValue}
              role="tab"
              className={tabClassName}
              tabIndex={isSelected ? 0 : -1}
              aria-selected={isSelected}
              onClick={() => {
                if (isSelected) {
                  return;
                }
                onChange?.(tabValue as T);
              }}
            >
              <span className="label">{label}</span>
              {isSelected && <motion.span className="underline" layoutId="underline" />}
            </button>
          );
        })}
      </div>

      <div className="panels">
        {panels.map((tab) => (
          <div
            key={tab.value}
            className="panel-content"
            tabIndex={0}
            aria-labelledby={tab.value}
            hidden={tab.value !== value}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
});
