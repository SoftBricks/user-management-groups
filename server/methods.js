if (Meteor.isServer) {
    Meteor.methods({
        /*
         * Adds a user to a group
         * @param String userId
         * @param String useremail
         * @param String groupId
         * @return Boolean
         *      true = user was added
         *      false = user was not added
         */
        'addUserToGroup': function (userId, useremail, groupId) {
            if (!userId || !useremail)
                throw new Meteor.error("groups", "You have to specify userid and useremail");
            if (!groupId)
                throw new Meteor.error("groups", "You did not specify a groupId");

            var identifier;
            if (useremail)
                identifier = {'emails.0.address': useremail};
            if (userId)
                identifier = {_id: userId};
            var user = Meteor.users.update(identifier,
                {
                    $addToSet: {
                        'profile.groups':  {
                            id: groupId
                        }
                    }
                });

            Groups.update({
                    _id: groupId
                }, {
                    $addToSet: {
                        users: {
                            id: userId
                        }
                    }
                }
            );
            if (user == 1)
                return true;
        },
        /*
         * removes a user from a group
         * @param String userId
         * @param String email
         * @param String groupId
         * @return Boolean
         *      true = removed user from group successfull
         *      error = removing user from group failed
         */
        'removeUserFromGroup': function (userId, email, groupId) {
            if (groupId) {
                var update = {
                    $pull: {
                        'profile.groups':{
                          id: groupId
                        }
                    }
                };
                var user;

                if (userId != "" && userId != undefined) {
                    user = Meteor.users.update({_id: userId}, update);
                } else if (email != "" && userId != undefined) {
                    user = Meteor.users.update({'emails.0.address': email}, update);
                }

                Groups.update({
                        _id: groupId
                    }, {
                        $pull: {
                            users: {
                                id: userId
                            }
                        }
                    }
                );

                if (!user)
                    throw new Meteor.error("user", "Found no user!");
            } else {
                throw new Meteor.error("group", "Found no group with specified groupid!");
            }
            return true;
        },

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
         * creates a group (autoform method call)
         * @param Object doc
         * @return Boolean
         *      true = created group successfull
         *      error = creating group failed
         */
        createGroup: function (doc, mod, documentId) {
            //TODO check if project exists
            var parentId = "";

            var parentGroup = Groups.findOne({
                groupname: doc.parentGroup
            });

            if(typeof parentGroup !== "undefined")
                parentId = parentGroup._id;

            if (doc.groupname) {
                var group = Groups.insert({
                    groupname: doc.groupname,
                    parentGroup: parentId,
                    leader: doc.leader,
                    projects: doc.projects,
                    agency: doc.agency,
                    users: doc.users
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
         * updates a group (autoform method call)
         * @param Object doc
         * @return Boolean
         *      true = edit group successfull
         *      error = edit group failed
         */
        updateGroup: function (doc, mod, documentId) {
            //TODO check rights
            if (true) {
                var parentId = "";
                var parentGroup = Groups.findOne({
                    groupname: doc.parentGroup
                });
                if(typeof parentGroup !== "undefined")
                    parentId = parentGroup._id;

                var group = Groups.update({
                        _id: documentId
                    }, {
                        $set: {
                            groupname: doc.groupname,
                            parentGroup: parentId,
                            leader: doc.leader,
                            projects: doc.projects,
                            agency: doc.agency,
                            users: doc.users
                        }
                    }
                );
                if (group != 1)
                    throw new Meteor.Error("group", "updating the group failed");

                return true;
            } else {
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
                Groups.update({_id: groupId}, {
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
                var users = Groups.findOne({_id:groupId}).users;
                var group = Groups.remove({_id: groupId});
                //Find children and remove parentId
                var children = Groups.update({parentGroup:groupId},{
                    $set:{parentGroup: null}
                });

                _.each(users, function(user){
                    Meteor.users.update(
                        {
                            _id:user.id
                        },{
                        $pull: {
                            'profile.groups': {
                                id:groupId
                            }
                        }
                    });
                });

                return true;
            } else {
                throw new Meteor.error("groups", "No group id was specified while removing group");
            }
        }
    });
}
