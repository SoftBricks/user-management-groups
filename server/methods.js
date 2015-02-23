if (Meteor.isServer) {
    Meteor.methods({
        //TODO Add teams also to the projects ??


        /*
         * checks if a given groupname is already existing in the database
         * @param String groupname
         * @return Boolean
         *      true = groupname is existing
         *      false = groupname not existing
         */
        checkGroupnameExisting: function (groupname) {
            var existingGroupname = Groups.find({groupname: groupname}).fetch();
            if (existingGroupname.length > 0)
                return true;

            return false;
        },
        /*
         * assigns a user to a group
         * @param String groupId
         * @param String userId
         * @param String email
         * @return Boolean
         *      true = assigned user to group successfull
         *      error = assigning user to group failed
         */
        assignUserToGroup: function (groupId, userId, email) {
            if (groupId) {
                var update = {$addToSet: {groups: groupId}};
                var user;

                if (userId != "" && userId != undefined) {
                    var user = Meteor.users.update({_id: userId}, update);
                } else if (email != "" && userId != undefined) {
                    var user = Meteor.users.update({'emails.0.address': email}, update);
                }

                if (!user)
                    throw new Meteor.error("user", "Found no user!");
            } else {
                throw new Meteor.error("group", "Found no group with specified groupid!");
            }
            return true;
        },
        /*
         * removes a user from a group
         * @param String groupId
         * @param String userId || email
         * @return Boolean
         *      true = removed user from group successfull
         *      error = removing user from group failed
         */
        removeUserFromGroup: function (groupId, userId, email) {
            if (groupId) {
                var update = {$pull: {groups: groupId}}
                var user;

                if (userId != "" && userId != undefined) {
                    var user = Meteor.users.update({_id: userId}, update);
                } else if (email != "" && userId != undefined) {
                    var user = Meteor.users.update({'emails.0.address': email}, update);
                }

                if (!user)
                    throw new Meteor.error("user", "Found no user!");
            } else {
                throw new Meteor.error("group", "Found no group with specified groupid!");
            }
            return true;
        },
        /*
         * creates a group
         * @param Object doc
         * @return Boolean
         *      true = created group successfull
         *      error = creating group failed
         */
        createGroup: function (doc) {
            //TODO check if project exists
            if (doc.groupname) {
                var group = Groups.insert({
                    groupname: doc.groupname,
                    parentGroup: doc.parentGroup,
                    leader: doc.leader,
                    projects: doc.projects,
                    agency: doc.agency
                });
                if (!group)
                    throw new Meteor.error("group", "Create group failed!");
            } else {
                if (name === "")
                    throw new Meteor.error("group", "Name was not specified!");
            }

            return true;
        },
        /*
         * updates a group
         * @param Object doc
         * @return Boolean
         *      true = edit group successfull
         *      error = edit group failed
         */
        updateGroup: function (doc, mod, documentId) {
            //TODO check rights
            if (true) {
                var group = Groups.update({
                        _id: documentId
                    }, {
                        $set: {
                            groupname: doc.groupname,
                            parentGroup: doc.parentGroup,
                            leader: doc.leader,
                            projects: doc.projects,
                            agency: doc.agency
                        }
                    }
                );
                if (group != 1)
                    throw new Meteor.Error("group", "updating the group failed");

                return true;
            }else{
                throw new Meteor.Error("group", "You have no rights to edit a group");
            }
        },
        /*
         * assigns a sub group to a group
         * @param String groupId
         * @param String parentGroupId
         * @return Boolean
         *      true = assign subgroup successfull
         *      error = assign subgroup failed
         */
        assignSubGroup: function (groupId, parentGroupId) {
            if (groupId && parentGroupId) {
                Groups.update({_id: grouId}, {
                    $set: {
                        parentGroup: parentGroupId
                    }
                });
            } else {
                if (parentGroupId === "")
                    throw new Meteor.error("group", "Parent group id was not specified!");
                if (groupId === "")
                    throw new Meteor.Error("group", "Group id was not specified");
            }
        },
        /*
         * remove a sub group from a group
         * @param String groupId
         * @param String parentGroupId
         * @return Boolean
         *      true = removed subgroup successfull
         *      error = remove subgroup failed
         */
        removeSubGroup: function (groupId, parentGroupId) {
            if (groupId && parentGroupId) {
                Groups.update({_id: grouId}, {
                    $set: {
                        parentGroup: null
                    }
                });
            } else {
                if (parentGroupId === "")
                    throw new Meteor.error("group", "Parent group id was not specified!");
                if (groupId === "")
                    throw new Meteor.Error("group", "Group id was not specified");
            }
        },
        /*
         * removes a group
         * @param String groupId
         * @return Boolean
         *      true = removed group successfull
         *      error = removing group failed
         */
        removeGroup: function (groupId) {
            if (groupId) {
                var group = Groups.remove({_id: groupId});
                //TODO Remove group id from users
                //Meteor.users.update({
                //    $pull: {groups: groupId}
                //});

                return true;
            }else{
                throw new Meteor.error("groups", "No group id was specified while removing group");
            }
        },

        //TODO move the two functions below in their own package
        /*
         * checks if a given leader really exists in the user database
         * @param String leader
         * @return Boolean
         *      true = leader is existing
         *      false = leader not existing
         */
        leaderExisting: function (leader) {
          //TODO check leader existing
        },
        /*
         * checks if a given agency really exists in the database
         * @param String agency
         * @return Boolean
         *      true = agency is existing
         *      false = agency not existing
         */
        agencyExisting: function (agency) {
            //TODO check leader existing
        }
    });
}