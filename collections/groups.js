Groups = new Mongo.Collection('groups');

SimpleSchema.messages({
    "groupnameExisting": "Groupname already exists",
    "groupnameNotExisting": "Group does not exist",
    "parentGroupNotSelf": "Parent Group can not be a group itself"
});
SchemaPlain.group = {
    groupname: {
        type: String,
        label: "Group name",
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
        label: "Leader",
        optional: true,
        custom: function() {
            if (Meteor.isClient) {
                if (this.value) {
                    var user = Meteor.users.findOne({
                        'emails.address': this.value
                    });
                    if (user) {
                        LeaderSearch.search();
                        return;
                    }
                    LeaderSearch.search(this.value);
                }
            }
        }
    },
    parentGroup: {
        type: String,
        label: "ParentGroup",
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
        label: "Users in group",
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
}