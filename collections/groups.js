Groups = new Mongo.Collection('groups');

//Groups schema

GroupSchema = new SimpleSchema({
    groupname: {
        type: String,
        label: "Group name",
        custom: function () {
            //TODO testing?
            if (Meteor.isClient) {
                var groupId = Router.current().getParams().groupId;
                if (groupId)
                    var currentGroupname = Groups.findOne({_id: groupId}).groupName;
            }
            if (currentGroupname != this.value || !currentGroupname) {
                if (Meteor.isClient && this.isSet) {
                    Meteor.call("checkGroupnameExisting", this.value, function (error, result) {
                        if (result === true) {
                            Groups.simpleSchema().namedContext("createGroupForm").addInvalidKeys([{
                                name: 'groupname',
                                type: 'notUniqueGroupname'
                            }]);
                        }
                    });
                }
            }
        }
    },
    leader: {
        type: String
    },
    agency: {
        type: String
    },
    projects: {
        type: [Object]
    },
    parentGroup: {
        type: String
    },
    'projects.$.projectId': {
        type: String
    },
    'projects.$.mayShare': {
        type: Boolean
    }
});

Groups.attachSchema(GroupSchema);

if (Meteor.isServer) {
    Groups._ensureIndex({
        'groupname': 1
    });
    Groups._ensureIndex({
        'agency': 1
    });
    Groups._ensureIndex({
        'projects.$.projectId': 1
    });
}