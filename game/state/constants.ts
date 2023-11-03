/**
 * IMPORTANT ONLY CHROMIUM BROWSERS.
 *
 * A requestPointerLock call immediately after the default unlock gesture MUST fail even when
 * transient activation is available, to prevent malicious sites from acquiring an unescapable
 * locked state through repeated lock attempts. On the other hand, a requestPointerLock call
 * immediately after a programmatic lock exit (through a exitPointerLock call) MUST succeed when
 * transient activation 6 is available, to enable applications to move frequently between
 * interaction modes, possibly through a timer or remote network activity.
 *
 * In other words, if the lock was exited from code then it can be re-entered immediately. If it
 * was exited by the user pressing the default exit key (usually ESC) then immediate re-entry MUST
 * fail and must wait at least 1.5 second before it can be re-entered. This is the loading time.
 */
export const PAUSE_LOADING_TIME = 1600;
