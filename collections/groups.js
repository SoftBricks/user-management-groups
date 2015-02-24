Groups = new Mongo.Collection('groups');

SimpleSchema.messages({
    "groupnameExisting": "Groupname already exists"
});
SchemaPlain.group = {
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
            if(Meteor.isClient)
                LeaderSearch.search(this.value);
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
        optional: true,
        custom: function () {
            if(Meteor.isClient)
                SubGroupSearch.search(this.value);
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
    },
    'users.$.useremail':{
        type: String,
        label: "Useremail"
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

Meteor.startup(function(){
    Schema.group = new SimpleSchema(SchemaPlain.group);
    Groups.attachSchema(Schema.group);

});

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