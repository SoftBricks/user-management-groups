UM.prototype.umGroupListItemHelper = {
};

UM.prototype.umGroupListItemEvents = {
    "click .clickableRow": function(e) {
        Router.go('umShowGroup', {
            groupId: this._id
        });
    }
};