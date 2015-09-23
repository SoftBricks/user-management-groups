UM.prototype.umShowGroupOnCreated = function () {
    var self = this;
    self.autorun(function () {
        var groupId = FlowRouter.getParam('groupId');
        self.subscribe('groups', groupId);
    });
};

UM.prototype.umShowGroupHelpers = {
    numberOfMembers: function () {
        if (this.users) {
            return this.users.length;
        } else {
            return 0;
        }
    },
    group: function () {
        return Groups.findOne({
            _id: FlowRouter.getParam('groupId')
        });
    },
    groupschema: function () {
        return Groups.simpleSchema();
    },
    getUsersForGroup: function () {
        return UserSearch.getData({
            transform: function (matchText, regExp) {
                return matchText;
            },
            sort: {
                isoScore: -1
            }
        });
    },
    user: function () {
        if (this.id && typeof this.id !== 'undefined') {
            var user = Meteor.users.findOne({
                _id: this.id
            });
        }
        if (user) {
            return user.emails[0].address;
        } else {
          return 'N.A.';
        }
    },
    parentGroupName: function () {
        if (this.parentGroup && typeof this.parentGroup !== 'undefined') {
            var group = Groups.findOne({
                _id: this.parentGroup
            });
            if (group) {
                return group.groupname;
            }
        } else {
          return 'N.A.';
        }
    },
    leaderEmail: function () {
        if (typeof this.leader !== 'undefined')
            var leader = Meteor.users.findOne({
                _id: this.leader
            });
        if (leader) {
            return leader.emails[0].address;
        } else {
          return 'N.A.';
        }
    },
    edit: function () {
        return __('editGroup');
    },
    abort: function () {
        return __('abort');
    }
};
