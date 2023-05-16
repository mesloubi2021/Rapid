import { utilObjectOmit, utilSafeString } from '@rapid-sdk/util';

import { localizer, t } from '../localizer';


/**
 *  Field
 *  A field associated with a presert
 */
export class Field {

  /**
   * @constructor
   * @param  context    Global shared application context
   * @param  fieldID    String unique ID for this field
   * @param  fieldData  Object containing the original properties for this field
   * @param  allFields  Object reference to the index of all the fields
   */
  constructor(context, fieldID, fieldData, allFields = {}) {
    this.context = context;

    this.id = fieldID;
    this.safeid = utilSafeString(fieldID);    // for use in classes, element ids, css selectors
    this.allFields = allFields;

    // Preserve and cleanup all original properties..
    this.orig = {};
    this.orig.autoSuggestions = fieldData.autoSuggestions ?? true;
    this.orig.caseSensitive = fieldData.caseSensitive ?? false;
    this.orig.customValues = fieldData.customValues ?? true;
    this.orig.default = fieldData.default;
    this.orig.geometry = fieldData.geometry;
    this.orig.icon = fieldData.icon;
    this.orig.increment = fieldData.increment ?? 1;
    this.orig.key = fieldData.key;
    this.orig.keys = fieldData.keys ?? [fieldData.key];
    this.orig.label = fieldData.label ?? '';
    this.orig.locationSet = fieldData.locationSet;
    this.orig.maxValue = fieldData.maxValue;
    this.orig.minValue = fieldData.minValue;
    this.orig.options = fieldData.options;
    this.orig.pattern = fieldData.pattern;
    this.orig.placeholder = fieldData.placeholder ?? '';
    this.orig.prerequisiteTag = fieldData.prerequisiteTag;
    this.orig.reference = fieldData.reference;
    this.orig.snake_case = fieldData.snake_case ?? true;
    this.orig.strings = fieldData.strings;
    this.orig.terms = (fieldData.terms ?? []).join();
    this.orig.type = fieldData.type;
    this.orig.universal = fieldData.universal ?? false;
    this.orig.urlFormat = fieldData.urlFormat;
    this.orig.usage = fieldData.usage;

    // Convert some `fieldData` properties to class properties.. (others will become class functions)
    Object.assign(this, utilObjectOmit(this.orig, ['increment', 'label', 'placeholder', 'terms']));
  }

  increment() {
    return this.type === 'number' ? this.increment : undefined;
  }

  title() {
    return this._resolveReference('label').t('label', { 'default': this.id });
  }

  label() {
    return this._resolveReference('label').tHtml('label', { 'default': this.id });
  }
  // _this.label = () => _this._resolveReference('label').t.append('label', { 'default': this.id });  // someday?

  placeholder() {
    return this._resolveReference('placeholder').t('placeholder', { 'default': this.orig.placeholder });
  }

  terms() {
    return this._resolveReference('terms').t('terms', { 'default': this.orig.terms })
      .toLowerCase().trim().split(/\s*,+\s*/);
  }

  matchGeometry(geom) {
    return !this.geometry || this.geometry.indexOf(geom) !== -1;
  }

  matchAllGeometry(geometries) {
    return !this.geometry || geometries.every(geom => this.geometry.indexOf(geom) !== -1);
  }

  t(scope, options) {
    return t(`_tagging.presets.fields.${this.id}.${scope}`, options);
  }

  tHtml(scope, options) {
    return t.html(`_tagging.presets.fields.${this.id}.${scope}`, options);
  }

  tAppend(scope, options) {
    return t.append(`_tagging.presets.fields.${this.id}.${scope}`, options);
  }

  hasTextForStringId(scope) {
    return localizer.hasTextForStringId(`_tagging.presets.fields.${this.id}.${scope}`);
  }

  _resolveReference(prop) {
    const val = this.orig[prop] || '';    // always lookup original properties, don't use the functions
    const match = val.match(/^\{(.*)\}$/);
    if (match) {
      const field = this.allFields[match[1]];
      if (field) {
        return field;
      }
      console.error(`Unable to resolve referenced field: ${match[1]}`);  // eslint-disable-line no-console
    }
    return this;
  }

}