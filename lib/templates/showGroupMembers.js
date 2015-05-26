UM.prototype.umShowGroupMembersHelpers = {
  'users': function(){
    console.log("users");
    return Groups.findOne({_id: FlowRouter.current().params.groupId}).users;
  }
};
