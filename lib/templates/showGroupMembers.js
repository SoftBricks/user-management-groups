UM.prototype.umShowGroupMembersHelpers = {
  users: function(){
    return Groups.findOne({_id: FlowRouter.current().params.groupId}).users;
  },
  user: function(){
    return Meteor.users.findOne({_id: this.id});
  },
};

UM.prototype.umShowGroupMembersEvents = {
  'click .removeUser': function(e) {
    console.log("remove user");
      var groupId = FlowRouter.getParam("groupId");
      Meteor.call('removeUserFromGroup', this._id, '', groupId);
  }
};
