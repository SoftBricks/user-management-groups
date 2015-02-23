UM.prototype.umEditGroupHelpers = {
    groupschema: function () {
        return Schema.group;
    },
    group: function () {
        return Groups.findOne({_id: Router.current().params.groupId});
    },
    agency : function(){
        if(SchemaPlain.user.agency)
            return true;
    },
    projects : function(){
        if(SchemaPlain.user.projects)
            return true;
    },
    getLeaders: function() {
        return LeaderSearch.getData({
            transform: function(matchText, regExp) {
                return matchText;
            },
            sort: {isoScore: -1}
        });
    },
    email: function () {
        if(this.emails)
            return this.emails[0].address;
    },
    getSubGroups: function() {
        return SubGroupSearch.getData({
            transform: function(matchText, regExp) {
                return matchText;
            },
            sort: {isoScore: -1}
        });
    },
    getUsersForGroup: function() {
        return UserSearch.getData({
            transform: function(matchText, regExp) {
                return matchText;
            },
            sort: {isoScore: -1}
        });
    }
};

UM.prototype.umEditGroupEvents = {
    'click #removeGroup': function () {
        groupId = Router.current().getParams().groupId;
        Meteor.call('removeGroup', groupId, function(err, res){
            console.log(err);
            if(!err)
                Router.go('/showGroups');
        });
    },
    'click .fullname': function (e) {
        //yes :P
        $('#leader').val($(e.target).html());

    },
    'click .parentGroup': function (e) {
        //yes :P
        $('#parentGroupName').val($(e.target).html());
    },
    'click .user': function (e) {
        //yes :P
        $('#userEmail').val($(e.target).html());
    }
};