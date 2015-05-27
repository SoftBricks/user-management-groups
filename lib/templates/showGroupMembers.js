UM.prototype.umShowGroupMembersHelpers = {
  users: function(){
    return Groups.findOne({_id: FlowRouter.current().params.groupId}).users;
  },
  user: function(){
    return Meteor.users.findOne({_id: this.id});
  }
};
