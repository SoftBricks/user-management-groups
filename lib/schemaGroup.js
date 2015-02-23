//TODO add and remove project id with project package
var extendUserSchema = {
    'profile.groups': {
        type: [String],
        label: "Groups",
        custom: function () {
            //TODO check if user is already in a group, but maybe not necessary?
        },
        optional:true
    }
};

if(typeof SchemaPlain !== 'undefined')
    _.merge(SchemaPlain.user, extendUserSchema);

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

