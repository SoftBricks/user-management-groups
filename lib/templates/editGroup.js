UM.prototype.umEditGroupHelpers = {
    groupschema: function() {
        return Schemas.group;
    },
    group: function() {
        return Groups.findOne({
            _id: Router.current().params.groupId
        });
    },
    agency: function() {
        if (SchemaPlain.user.agency)
            return true;
    },
    projects: function() {
        if (SchemaPlain.user.projects)
            return true;
    },
    getLeaders: function() {
        return LeaderSearch.getData({
            transform: function(matchText, regExp) {
                return matchText;
            },
            sort: {
                isoScore: -1
            }
        });
    },
    email: function() {
        if (this.emails)
            return this.emails[0].address;
    },
    getSubGroups: function() {
        return SubGroupSearch.getData({
            transform: function(matchText, regExp) {
                return matchText;
            },
            sort: {
                isoScore: -1
            }
        });
    },
    getUsersForGroup: function() {
        return UserSearch.getData({
            transform: function(matchText, regExp) {
                return matchText;
            },
            sort: {
                isoScore: -1
            }
        });
    },
    user: function(){
        if(this.id && typeof this.id !== 'undefined'){
            var user = Meteor.users.findOne({_id:this.id});
        }
        if(user){
            return user.emails[0].address;
        }
    },
    parentGroupName: function (){
        if(this.parentGroup && typeof this.parentGroup !== 'undefined')
            return Groups.findOne({_id:this.parentGroup}).groupname;
    },
    leaderEmail: function (){
        if(typeof this.leader !== 'undefined')
            var leader = Meteor.users.findOne({_id:this.leader});
        if(leader)
            return leader.emails[0].address;
    },
    abort: function () {
        return __('abort');
    },
    remove: function () {
        return __('remove');
    },
    save: function () {
        return __('save');
    }
};

UM.prototype.umEditGroupEvents = {
    'click #removeGroup': function() {
        groupId = Router.current().getParams().groupId;
        Meteor.call('removeGroup', groupId, function(err, res) {
            console.log(err);
            if (!err)
                Router.go('/showGroups');
        });
    },
    'click .fullname': function (e) {
        //yes :P
        var val = $(e.target).html();
        if(this.emails && this.emails[0] && this.emails[0].address){
            val = this.emails[0].address;
        }
        $('#leader').val(val);

    },
    'click .parentGroup': function (e) {
        //yes :P
        var val = $(e.target).html();
        if(this.groupname){
            val = this.groupname;
        }
        $('#parentGroupName').val(val);
    },
    'click .user': function(e) {
        //yes :P
        $('#userEmail').val($(e.target).html());
    },
    'click .clickableSpan': function(e) {
        var groupId = Router.current().params.groupId;
        UserSearch.search();
        Meteor.call('addUserToGroup', this._id, this.emails[0].address, groupId);
    },
    'keyup #users ': function(e) {
        var user = Meteor.users.findOne({
            _id: this.value
        });
        if(user){
            UserSearch.search();
            return;
        }
        UserSearch.search(e.target.value);
    },
    'click .removeUser': function(e) {
        var groupId = Router.current().params.groupId;
        Meteor.call('removeUserFromGroup', this.id, this.useremail, groupId);
    },
    'click .userGroupRoles': function(e){
        Router.go('/editGroup/'+Router.current().params.groupId+'/addUserToGroupRole/' + this.id);
    }
};