import { type IGun, type IGunInstance } from 'gun';

declare global {
  /**
   * Gun.js is loaded as a global variable in the browser from the CDN.
   */
  var GUN: IGun;

  /**
   * Global instance of Gun.js.
   */
  var __gunInstance: IGunInstance;
}
