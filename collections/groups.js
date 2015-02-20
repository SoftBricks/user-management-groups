Groups = new Mongo.Collection('groups');

//Groups schema

GroupSchema = new SimpleSchema({
    groupname: {
        type: String
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