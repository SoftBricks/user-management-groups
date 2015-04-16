if (Meteor.isServer) {
    checkRightsGroup = {
      'isLeader': function(email, groupId){
          var group = Groups.findOne({_id: groupId});
          if(group.leader === email)
              return true;

          return Roles.userIsInRole(Meteor.userId(), ['admin','superAdmin']);
      }
    };

    if(typeof checkRights !== 'undefined')
        _.merge(checkRights, checkRightsGroup);

    Meteor.methods({
        /**
         * Add a user to a group
         * @param String userId
         * @param String groupId
         * @param Array roles
         * @return Boolean
         *      true = user was added
         */
        'addUserToGroup': function (userId, groupId, roles) {
            var roles = roles || [];
            if(checkRights.isLeader(Meteor.user().emails[0].address, groupId)) {

                if (!groupId)
                    throw new Meteor.Error("groups", "You did not specify a groupId");

                var identifier;
                if (userId)
                    identifier = {_id: userId};
                var user = Meteor.users.update(identifier,
                    {
                        $addToSet: {
                            'profile.groups': {
                                id: groupId
                            }
                        }
                    });

                Groups.update({
                        _id: groupId
                    }, {
                        $addToSet: {
                            users: {
                                id: userId,
                                roles:roles
                            }
                        }
                    }
                );
                if (user == 1)
                    return true;
            }
        },
        /**
         * removes a user from a group
         * @param String userId
         * @param String email
         * @param String groupId
         * @return Boolean
         *      true = removed user from group successfull
         */
        'removeUserFromGroup': function (userId, email, groupId) {
            if(checkRights.isLeader(Meteor.user().emails[0].address, groupId)) {
                if (groupId) {
                    var update = {
                        $pull: {
                            'profile.groups': {
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
                        throw new Meteor.Error("user", "Found no user!");
                } else {
                    throw new Meteor.Error("group", "Found no group with specified groupid!");
                }
                return true;
            }
        },

        /**
        * checks if a given groupname already exists
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

        /**
         * creates a group (autoform method call)
         * @param Object doc
         * @param Object mod
         * @param String documentId
         * @return Boolean
         *      true = created group successfull
         */
        createGroup: function (doc, mod, documentId) {

            //TODO check if project exists
            //if(checkRights.checkUserRight("",Meteor.userId())) {
                var parentId = "";

                var parentGroup = Groups.findOne({
                    groupname: doc.parentGroup
                });

                if (typeof parentGroup !== "undefined")
                    parentId = parentGroup._id;
                var leaderId = null;
                leader = Meteor.users.findOne({'emails.0.address': doc.leader});
                if(leader){
                  leaderId = leader._id;
                }

                if (doc.groupname) {
                    var group = Groups.insert({
                        groupname: doc.groupname,
                        parentGroup: parentId,
                        leader: leaderId,
                        projects: doc.projects,
                        agency: doc.agency,
                        users: doc.users
                    });
                    if (!group)
                        throw new Meteor.Error("group", "Create group failed!");

                    if(leaderId)
                      Meteor.call('addUserToGroup', leaderId, group);
                } else {
                    if (name === "")
                        throw new Meteor.Error("group", "Name was not specified!");
                }

                return true;
            //}
        },
        /**
         * updates a group (autoform method call)
         * @param Object doc
         * @param Object mod
         * @param String documentId
         * @return Boolean
         *      true = edit group successfull
         */
        updateGroup: function (doc, mod, documentId) {
            if(!Meteor.user()){
              throw new Meteor.Error("group", "you need to be logged in to do this");
            }
            if(checkRights.isLeader(Meteor.user().emails[0].address, documentId)) {
                var parentId = "";
                var parentGroup = Groups.findOne({
                    groupname: doc.parentGroup
                });
                if(typeof parentGroup !== "undefined")
                    parentId = parentGroup._id;

                var leaderId = null;
                leader = Meteor.users.findOne({'emails.0.address': doc.leader});
                if(leader){
                  leaderId = leader._id;
                }

                var group = Groups.update({
                        _id: documentId
                    }, {
                        $set: {
                            groupname: doc.groupname,
                            parentGroup: parentId,
                            leader: leaderId,
                            projects: doc.projects,
                            agency: doc.agency,
                            users: doc.users
                        }
                    }
                );
                if (group != 1)
                    throw new Meteor.Error("group", "updating the group failed");

                if(leaderId)
                    Meteor.call('addUserToGroup', leaderId, documentId);

                return true;
            }
        },
        /**
         * assigns a sub group to a group
         * @param String groupId
         * @param String parentGroupId
         * @return Boolean
         *      true = assign subgroup successfull
         */
        assignSubGroup: function (groupId, parentGroupId) {
            if(checkRights.isLeader(Meteor.user().emails[0].address, groupId)) {
                if (groupId && parentGroupId) {
                    Groups.update({_id: groupId}, {
                        $set: {
                            parentGroup: parentGroupId
                        }
                    });
                } else {
                    if (parentGroupId === "")
                        throw new Meteor.Error("group", "Parent group id was not specified!");
                    if (groupId === "")
                        throw new Meteor.Error("group", "Group id was not specified");
                }
            }
        },
        /**
         * remove a sub group from a group
         * @param String groupId
         * @param String parentGroupId
         * @return Boolean
         *      true = removed subgroup successfull
         */
        removeSubGroup: function (groupId, parentGroupId) {
            if(checkRights.isLeader(Meteor.user().emails[0].address, groupId)) {
                if (groupId && parentGroupId) {
                    Groups.update({_id: grouId}, {
                        $set: {
                            parentGroup: null
                        }
                    });
                } else {
                    if (parentGroupId === "")
                        throw new Meteor.Error("group", "Parent group id was not specified!");
                    if (groupId === "")
                        throw new Meteor.Error("group", "Group id was not specified");
                }
            }
        },
        /**
         * removes a group
         * @param String groupId
         * @return Boolean
         *      true = removed group successfull
         */
        removeGroup: function (groupId) {
            if (Roles.userIsInRole(Meteor.userId(),['admin','superAdmin'])) {
                if (groupId) {
                    var users = Groups.findOne({_id: groupId}).users;
                    var group = Groups.remove({_id: groupId});
                    //Find children and remove parentId
                    var children = Groups.update({parentGroup: groupId}, {
                        $set: {parentGroup: null}
                    });

                    _.each(users, function (user) {
                        Meteor.users.update(
                            {
                                _id: user.id
                            }, {
                                $pull: {
                                    'profile.groups': {
                                        id: groupId
                                    }
                                }
                            });
                    });

                    Meteor.roles.remove({groupId:groupId});

                    return true;
                } else {
                    throw new Meteor.Error("groups", "No group id was specified while removing group");
                }
            }
        },
        /**
         * add user role
         * @param String groupId
         * @param String userId
         * @param String role
         * @return Boolean
         *      true = added role
         */
        addUserRoleInGroup: function(groupId, userId, role){
            if(Roles.userIsInGroupRole(Meteor.userId(), groupId, 'admin') || Roles.userIsInRole(Meteor.userId(),['superAdmin','admin'])) {
                if (typeof groupId !== 'undefined'
                    && typeof userId !== 'undefined'
                    && typeof role !== 'undefined') {
                    var roleExists = Meteor.roles.findOne({name: role, groupId: groupId});
                    if (!roleExists)
                        throw new Meteor.Error("GroupUserRoles", "The role does not exist");

                    Groups.update({_id: groupId, 'users.id': userId}, {
                        $addToSet: {
                            'users.$.roles': role
                        }
                    });
                }
            }else{
                throw new Meteor.error("addUserRoleInGroup", "You are not allowed to add User Roles in this Group");
            }
        },
        /**
         * add user role
         * @param String groupId
         * @param String userId
         * @param String role
         * @return Boolean
         *      true = added role
         */
        deleteUserRoleInGroup: function(groupId, userId, role){
            if(Roles.userIsInGroupRole(Meteor.userId(), groupId, 'admin') || Roles.userIsInRole(Meteor.userId(),['superAdmin','admin'])) {
                if (typeof groupId !== 'undefined'
                    && typeof userId !== 'undefined'
                    && typeof role !== 'undefined') {
                    var roleExists = Meteor.roles.findOne({name: role, groupId: groupId});
                    if (!roleExists)
                        throw new Meteor.Error("GroupUserRoles", "The role does not exist");

                    Groups.update({_id: groupId, 'users.id': userId}, {
                        $pull: {
                            'users.$.roles': role
                        }
                    });
                }
            }else{
                throw new Meteor.error("deleteUserRoleInGroup", "You are not allowed to delete User Roles in this Group");
            }
        }
    });
}
