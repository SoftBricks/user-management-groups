UM.prototype.umShowGroupHelpers = {
    group: function(){
        return Groups.findOne({_id: Router.current().params.groupId});
    },
    groupschema: function(){
        return Schema.group;
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
        if(this.parentGroup && typeof this.parentGroup !== 'undefined'){
            var group = Groups.findOne({_id:this.parentGroup});
            if(group){
                return group.groupname;
            }
        }
    },
    leaderEmail: function (){
        if(typeof this.leader !== 'undefined')
            var leader = Meteor.users.findOne({_id:this.leader});
        if(leader)
            return leader.emails[0].address;
    },
    edit: function () {
        return __('editGroup');
    },
    abort: function () {
        return __('abort');
    }
};