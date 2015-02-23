Groups = new Mongo.Collection('groups');

//Groups schema
Schema = {};
//SimpleSchema.debug = true;
SimpleSchema.messages({
    "groupnameExisting": "Groupname already exists"
});
var groupSchema = {
    groupname: {
        type: String,
        label: "Group name",
        unique:true,
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
                            Groups.simpleSchema().namedContext("addGroupForm").addInvalidKeys([{
                                name: 'groupname',
                                type: 'groupnameExisting'
                            }]);
                        }
                    });
                }
            }
        }
    },
    leader: {
        type: String,
        label: "Leader",
        optional: true,
        custom: function () {
            //TODO Search user as leader
        }
    },
    //agency: {
    //    type: String,
    //    label: "Agency",
    //    optional: true
    //},
    //projects: {
    //    type: [Object],
    //    label: "Projects",
    //    optional: true
    //},
    parentGroup: {
        type: String,
        label: "ParentGroup",
        optional: true
    }
    //'projects.$.projectId': {
    //    type: String,
    //    optional:true
    //},
    //'projects.$.mayShare': {
    //    type: Boolean,
    //    optional:true
    //}
};

if(typeof GroupExtender != "undefined" && GroupExtender.extendSchema)
    _.merge(groupSchema, GroupExtender.extendSchema);

Schema.groupSchema = new SimpleSchema(groupSchema);
Groups.attachSchema(Schema.groupSchema);

if (Meteor.isServer) {
    Groups._ensureIndex({
        'groupname': 1
    });
    Groups._ensureIndex({
        'agency': 1
    });
    //Groups._ensureIndex({
    //    'projects.$.projectId': 1
    //});
}