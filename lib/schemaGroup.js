//Adds groupschema to user
GM = function () {

};
//TODO add and remove project id with project package
GM.prototype.schemaGroups = {
    'profile.groups': {
        type: [String],
        label: "Groups",
        custom: function () {
            //TODO check if user is already in a group, but maybe not necessary?
        }
    }
};

GroupManager = new GM();
