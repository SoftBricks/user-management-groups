//TODO add and remove project id with project package
var extendUserSchema = {
    'profile.groups': {
        type: [Object],
        label: "Groups",
        optional:true
    },
    'profile.groups.$.id': {
        type: String,
        label: "Group id"
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

