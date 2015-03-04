Meteor.publish("groups", function() {
    return publishGroups(this);
});
Meteor.publish("usersInGroup", function(groupId) {
    return Meteor.users.find({'profile.groups.id': groupId});
});

publishGroups = function(context) {
    if (context.userId) {
        var user = Meteor.users.findOne({
            _id: context.userId
        });
        if (Roles.userIsInRole(context.userId, ['admin', 'superAdmin'])) {
            return Groups.find();
        } else {
            return Groups.find({
                leader: context.userId
            });
        }
    } else {
        return [];
    }
};