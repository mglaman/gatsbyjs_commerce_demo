"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

const nodeFromData = (datum, createNodeId) => {
  const _datum$attributes = datum.attributes,
        _datum$attributes2 = _datum$attributes === void 0 ? {} : _datum$attributes,
        _attributes_id = _datum$attributes2.id,
        attributes = (0, _objectWithoutPropertiesLoose2.default)(_datum$attributes2, ["id"]);

  const preservedId = typeof _attributes_id !== `undefined` ? {
    _attributes_id
  } : {};
  return Object.assign({
    id: createNodeId(datum.id),
    drupal_id: datum.id,
    parent: null,
    children: []
  }, attributes, preservedId, {
    internal: {
      type: datum.type.replace(/-|__|:|\.|\s/g, `_`)
    }
  });
};

exports.nodeFromData = nodeFromData;