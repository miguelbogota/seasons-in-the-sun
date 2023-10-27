import { type IGun } from 'gun';

declare global {
  /**
   * Gun.js is loaded as a global variable in the browser from the CDN.
   */
  var GUN: IGun;
}
