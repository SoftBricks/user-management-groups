UM.prototype.umShowGroupHelpers = {
    group: function(){
        return Groups.findOne({_id: Router.current().params.groupId});
    },
    groupschema: function(){
        return Schema.group;
    },
    user: function(){
        return Meteor.users.findOne({_id:this.id}).emails[0].address;
    },
    parentGroupName: function (){
        if(typeof this.parentGroup !== 'undefined')
            return Groups.findOne({_id:this.parentGroup}).groupname;
    }
};