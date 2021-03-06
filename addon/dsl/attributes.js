import Ember from 'ember';
var Attributes, attributes;

attributes = Attributes = (function() {
  function Attributes() {}

  Attributes.detect = function(modelType) {
    return this.withId(modelType);
  };

  Attributes.withId = function(modelType) {
    var attrs;
    attrs = this.withoutId(modelType);
    attrs.unshift("id");
    return attrs;
  };

  Attributes.forSearch = function(modelType){
    return this.withoutRelations(modelType);
  };

  Attributes.forSort = function(modelType){
    var attributes = Ember.A(['id']);
    attributes.pushObjects(this.withoutRelations(modelType));
    return attributes;
  };

  Attributes.withoutRelations = function(modelType){
    var attributes = Ember.A();
    if(!modelType || !modelType['eachComputedProperty']){
      return Ember.A();
    }
    modelType.eachComputedProperty((function(_this) {
      return function(attribute, meta) {
        if (meta.isAttribute && _this.systemAttrs(modelType).indexOf(attribute) < 0) {
          return attributes.push(attribute);
        }
      };
    })(this));
    return attributes;
  };

  Attributes.withoutId = function(modelType) {
    attributes = Ember.A();
    modelType.eachComputedProperty((function(_this) {
      return function(attribute, meta) {
        if (meta.isAttribute && _this.systemAttrs(modelType).indexOf(attribute) < 0) {
          return attributes.push(attribute);
        }
      };
    })(this));
    this.relations(modelType, attributes, false);
    return attributes;
  };

  Attributes.relations = function(modelType, attrs, hasMany) {
    if (attrs == null) {
      attrs = Ember.A();
    }
    if (hasMany == null) {
      hasMany = true;
    }
    if(!modelType ||!modelType['eachRelationship']){
      return Ember.A();
    }
    modelType.eachRelationship((function() {
      return function(attribute, meta) {
        if (hasMany) {
          return attrs.push(attribute);
        } else {
          if (meta.kind !== "hasMany") {
            return attrs.push(attribute);
          }
        }
      };
    })(this));
    return attrs;
  };

  Attributes.isBelongsTo = function(modelType, property) {
    var _belongsTo;
    _belongsTo = false;
    modelType.eachRelationship((function() {
      return function(attribute, meta) {
        if (meta.key === property && meta.kind === "belongsTo") {
          return _belongsTo = true;
        }
      };
    })(this));
    return _belongsTo;
  };

  Attributes.relationForType = function(modelType, relation) {
    var type;
    type = void 0;
    modelType.eachRelationship((function() {
      return function(attribute, meta) {
        if (meta.key === relation) {
          return type = meta.type;
        }
      };
    })(this));
    return type;
  };

  Attributes.systemAttrs = function() {
    return Ember.A(["created_at", "updated_at"]);
  };

  return Attributes;

})();

export default attributes;
