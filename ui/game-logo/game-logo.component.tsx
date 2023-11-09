import clsx from 'clsx';

export type GameLogoProps = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * GameLogo component.
 */
export function GameLogo(props: GameLogoProps) {
  const { className, style } = props;

  const rootClassName = clsx('game-logo', className);

  return (
    <h1 className={rootClassName} style={style}>
      <span>Seasons in</span>
      <span>the Sun</span>
    </h1>
  );
}
