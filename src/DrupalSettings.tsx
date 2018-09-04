/* tslint:disable:quotemark */
import { extend } from 'lodash'

// Exclude Drupal-object so the build does not crash but we can still use it
// when available.
declare var Drupal: any;
declare var window;
let DrupalSettings: any;

// from Drupal.
const checkPlain = (str) => {
  let character;
  let regex;
  const replace = { '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' };
  str = String(str);
  for (character in replace) {
    if (replace.hasOwnProperty(character)) {
      regex = new RegExp(character, 'g');
      str = str.replace(regex, replace[character]);
    }
  }
  return str;
};



DrupalSettings = Drupal;

export default DrupalSettings;
