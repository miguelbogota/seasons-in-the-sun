import { createCustomEvent } from '@app/lib/custom-events';

export type CameraControlEvents = 'lock-controls' | 'unlock-controls';

export type CameraControlPayload = null;

export const useCameraControlEvents = createCustomEvent<CameraControlEvents, CameraControlPayload>({
  name: 'pointer-lock-controls',
});

export function emitCameraControlEvent(event: CameraControlEvents, payload: CameraControlPayload) {
  return useCameraControlEvents.emit(event, payload);
}
