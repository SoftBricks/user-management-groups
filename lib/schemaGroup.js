//TODO add and remove project id with project package
var extendUserSchema = {
    'profile.groups': {
        type: [Object],
        label: function() {
            return __("groupIds");
        },
        optional:true
    },
    'profile.groups.$.id': {
        type: String,
        label: function() {
            return __("groupId");
        },
        index: 1
    }
};
Meteor.users.attachSchema(extendUserSchema);

if(typeof UM !== 'undefined'){
    UM.prototype.onRemoveUser.push(function(userId){
        Groups.update({
            users: {
                $elemMatch:{
                    id: userId
                }
            }
        },{
            $pull: {
                users:{
                    id: userId
                }
            }
        });

        Groups.update({
            leader: userId
        },{
            $set: {
                leader: null
            }
        });
    });
}

Meteor.startup(function() {
    GroupsPages = new Meteor.Pagination(Groups, {
        availableSettings: {
            perPage: 25,
            sort: true,
            filters: true
        },
        templateName: 'umShowGroups',
        itemTemplate: 'groupListItem'
    });
});

