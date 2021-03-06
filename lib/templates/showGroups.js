UM.prototype.umShowGroupsOnCreated = function () {
    var self = this;
    self.autorun(function () {
        // rerun on changes in the user
        Meteor.user();
        handle = self.subscribe('groups');
    });
};

UM.prototype.umShowGroupsHelpers = {
    groups: function () {
        return Groups.find().fetch();
    },
    //email: function(){
    //    return this.emails[0].address;
    //},
    perPage: function () {
        Session.get(GroupsPages.id + ".ready");
        return GroupsPages.perPage;
    },
    //pages: function(){
    //    console.log(Pages);
    //},
    groupschema: function () {
        if (Schemas.group)
            return true;
    }
};

UM.prototype.umShowGroupsEvents = {
    "click .perPage": function (e) {
        var pp;
        pp = $(e.currentTarget).data("pp");
        return GroupsPages.set("perPage", pp);
    },
    "click .list-item": function(){
      FlowRouter.go('/showGroup/:groupId/', {
        groupId: this._id
      });
    }
};
