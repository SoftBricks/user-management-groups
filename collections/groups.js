Groups = new Mongo.Collection('groups');

SimpleSchema.messages({
    "groupnameExisting": "Groupname already exists",
    "groupnameNotExisting": "Group does not exist"
});
SchemaPlain.group = {
    groupname: {
        type: String,
        label: "Group name",
        unique:true,
        custom: function () {
            //TODO testing?
            if (Meteor.isClient) {
                var groupId = Router.current().params.groupId;
                if (groupId)
                    var currentGroupname = Groups.findOne({_id: groupId}).groupname;
                if (currentGroupname != this.value || typeof currentGroupname === 'undefined') {
                    if (Meteor.isClient && this.isSet) {
                        Meteor.call("checkGroupnameExisting", this.value, function (error, result) {
                            if (result === true) {
                                Groups.simpleSchema().namedContext("addGroupForm").addInvalidKeys([{
                                    name: 'groupname',
                                    type: 'groupnameExisting'
                                }]);
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
        custom: function () {
            if(Meteor.isClient){
                var user = Meteor.users.findOne({
                    'emails.address': this.value
                });
                if(user){
                    return;
                }
                LeaderSearch.search(this.value);
            }
        }
    },
    parentGroup: {
        type: String,
        label: "ParentGroup",
        optional: true,
        custom: function () {
            if (Meteor.isClient) {
                var group = Groups.findOne({
                    groupname: this.value
                });
                if (group) {
                    return;
                }
                SubGroupSearch.search(this.value);
                if (this.value != "" && typeof this.value !== 'undefined') {
                    Meteor.call("checkGroupnameExisting", this.value, function (error, result) {
                        if (result !== true) {
                            Groups.simpleSchema().namedContext("addGroupForm").addInvalidKeys([{
                                name: 'parentGroup',
                                type: 'groupnameNotExisting'
                            }]);
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

Meteor.startup(function(){
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