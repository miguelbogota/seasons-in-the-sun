import { useGameMenuState } from '@app/game/menu';
import { type EventManager, type ReactThreeFiber, useThree } from '@react-three/fiber';
import { forwardRef, useEffect, useMemo } from 'react';
import { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib';

import { useCameraControlEvents } from './events';

/**
 * Props for the CameraControl component.
 */
export type CameraControlProps = ReactThreeFiber.Object3DNode<
  PointerLockControlsImpl,
  typeof PointerLockControlsImpl
>;

/**
 * Camera controls using the PointerLockControls from three-stdlib which is a wrapper around the
 * PointerLock API.
 */
export const CameraControl = forwardRef<PointerLockControlsImpl, CameraControlProps>(
  function CameraControlRoot(props, ref) {
    const setEvents = useThree((state) => state.setEvents);
    const gl = useThree((state) => state.gl);
    const camera = useThree((state) => state.camera);
    const invalidate = useThree((state) => state.invalidate);
    const events = useThree((state) => state.events) as EventManager<HTMLElement>;
    const get = useThree((state) => state.get);
    const set = useThree((state) => state.set);
    const domElement = (events.connected ?? gl.domElement) as HTMLElement;

    const controls = useMemo(() => new PointerLockControlsImpl(camera), [camera]);

    const close = useGameMenuState((state) => state.close);
    const open = useGameMenuState((state) => state.open);
    const setLoading = useGameMenuState((state) => state.setLoading);

    useEffect(() => {
      controls.connect(domElement);
      // Force events to be centered while PLC is active
      const oldComputeOffsets = get().events.compute;
      setEvents({
        compute(_, state) {
          const offsetX = state.size.width / 2;
          const offsetY = state.size.height / 2;
          state.pointer.set(
            (offsetX / state.size.width) * 2 - 1,
            -(offsetY / state.size.height) * 2 + 1,
          );
          state.raycaster.setFromCamera(state.pointer, state.camera);
        },
      });
      return () => {
        controls.disconnect();
        setEvents({ compute: oldComputeOffsets });
      };
    }, [controls, domElement, get, setEvents]);

    useEffect(() => {
      const onChange = () => {
        invalidate();
      };

      const onLock = () => {
        close();
        setLoading(false);
      };

      const onUnlock = () => {
        setLoading(true);
        open();
        timeout(() => setLoading(false));
      };

      controls.addEventListener('change', onChange);
      controls.addEventListener('lock', onLock);
      controls.addEventListener('unlock', onUnlock);

      return () => {
        controls.removeEventListener('change', onChange);
        controls.addEventListener('lock', onLock);
        controls.addEventListener('unlock', onUnlock);
      };
    }, [controls, invalidate, close, setLoading, open]);

    useCameraControlEvents('lock-controls', () => controls.lock());
    useCameraControlEvents('unlock-controls', () => controls.unlock());

    useEffect(() => {
      const old = get().controls;
      set({ controls });
      return () => set({ controls: old });
    }, [controls, get, set]);

    return <primitive ref={ref} object={controls} {...props} />;
  },
);

function timeout(callback: () => void) {
  // IMPORTANT ONLY CHROMIUM BROWSERS.
  //
  // A requestPointerLock call immediately after the default unlock gesture MUST fail even when
  // transient activation is available, to prevent malicious sites from acquiring an unescapable
  // locked state through repeated lock attempts. On the other hand, a requestPointerLock call
  // immediately after a programmatic lock exit (through a exitPointerLock call) MUST succeed when
  // transient activation 6 is available, to enable applications to move frequently between
  // interaction modes, possibly through a timer or remote network activity.
  //
  // In other words, if the lock was exited from code then it can be re-entered immediately. If it
  // was exited by the user pressing the default exit key (usually ESC) then immediate re-entry MUST
  // fail and must wait at least 1.5 second before it can be re-entered. This is the loading time.
  const LOADING_TIME = 1600;

  return new Promise((resolve) =>
    setTimeout(() => {
      callback();
      resolve(undefined);
    }, LOADING_TIME),
  );
}
