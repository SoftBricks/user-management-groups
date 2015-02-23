UM.prototype.umAddGroupHelpers = {
    groupschema: function () {
        return Schema.group;
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
    }
};
UM.prototype.umAddGroupEvents = {
    'click .fullname': function (e) {
        //yes :P
        $('#leader').val($(e.target).html());

    },
    'click .parentGroup': function (e) {
        //yes :P
        $('#parentGroupName').val($(e.target).html());
    }
};