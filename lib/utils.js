SchemaManager.extendGroupSchemaExtern = function (schema) {
    if (typeof SchemaPlain !== 'undefined') {
        _.merge(SchemaPlain.group, schema);
        Schemas.group = new SimpleSchema(SchemaPlain.group);
        Groups.attachSchema(Schemas.group);
    }
};