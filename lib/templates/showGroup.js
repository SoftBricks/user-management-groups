UM.prototype.umShowGroupHelpers = {
    group: function(){
        return Groups.findOne({_id: Router.current().params.groupId});
    },
    groupschema: function(){
        return Schema.group;
    }
};