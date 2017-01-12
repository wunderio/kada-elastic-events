
// Exclude Drupal-object so the build does not crash but we can still use it when available.
declare var Drupal: any;
let DrupalSettings: any;

// If developing separately from Drupal, the settings need to be shimmed.
if (typeof Drupal === 'undefined') {
  DrupalSettings = require('../kada-config.js');
  window['Drupal'] = DrupalSettings;
} else {
  DrupalSettings = Drupal;
}

export default DrupalSettings;