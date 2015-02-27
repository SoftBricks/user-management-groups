Groups = new Mongo.Collection('groups');

SchemaPlain.group = {
    groupname: {
        type: String,
        label: function() {
            return __("groupname");
        },
        unique: true,
        custom: function() {
            //TODO testing?
            if (Meteor.isClient) {
                var groupId = Router.current().params.groupId;
                var currentGroupname = null;
                if (groupId) {
                    currentGroupname = Groups.findOne({
                        _id: groupId
                    }).groupname;
                }
                if (currentGroupname !== this.value && currentGroupname !== null) {
                    if (Meteor.isClient && this.isSet) {
                        Meteor.call("checkGroupnameExisting", this.value, function(error, result) {
                            if (result === true) {
                                var invalidKeys = [{
                                    name: 'groupname',
                                    type: 'groupnameExisting'
                                }];
                                Groups.simpleSchema().namedContext("addGroupForm").addInvalidKeys(invalidKeys);
                                Groups.simpleSchema().namedContext("editGroupForm").addInvalidKeys(invalidKeys);
                            }
                        });
                    }
                }
            }
        }
    },
    leader: {
        type: String,
        label: function() {
            return __("leader");
        },
        optional: true,
        custom: function() {
            var self = this;
            if (Meteor.isClient) {
                if (self.value) {
                    Meteor.call('checkEmailExisting', self.value, function (error, result) {
                        // if result and email NOT existing
                        if(result === false){
                            LeaderSearch.search(self.value);
                        }
                    });
                }
            }
        }
    },
    parentGroup: {
        type: String,
        label: function() {
            return __("parentGroup");
        },
        optional: true,
        custom: function() {
            if (this.value === this.field('groupname').value)
                return 'parentGroupNotSelf';

            if (Meteor.isClient) {
                var group = Groups.findOne({
                    groupname: this.value
                });
                if (group) {
                    SubGroupSearch.search();
                    return;
                }
                SubGroupSearch.search(this.value);
                if (this.value !== "" && typeof this.value !== 'undefined') {
                    Meteor.call("checkGroupnameExisting", this.value, function(error, result) {
                        if (result !== true) {
                            var invalidKeys = [{
                                name: 'parentGroup',
                                type: 'groupnameNotExisting'
                            }];
                            Groups.simpleSchema().namedContext("addGroupForm").addInvalidKeys();
                            Groups.simpleSchema().namedContext("editGroupForm").addInvalidKeys();
                        }
                    });
                }
            }
        }
    },
    users: {
        type: [Object],
        label: function() {
            return __("members");
        },
        optional: true
    },
    'users.$.id': {
        type: String,
        label: "User id"
    }
};

Meteor.startup(function() {
    Schema.group = new SimpleSchema(SchemaPlain.group);
    Groups.attachSchema(Schema.group);

});

if (Meteor.isServer) {
    Groups._ensureIndex({
        'groupname': 1
    });
    Groups._ensureIndex({
        'parentGroup': 1
    });
    Groups._ensureIndex({
        'leader': 1
    });
    Groups._ensureIndex({
        'users': 1
    });
}