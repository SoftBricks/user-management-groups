//Adds groupschema to user
GM = function () {

};
//TODO add and remove project id with package
GM.prototype.schemaGroups = {
    'profile.groups': {
        type: [String],
        label: "Groups",
        custom: function () {
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
    }
};

GroupManager = new GM();
