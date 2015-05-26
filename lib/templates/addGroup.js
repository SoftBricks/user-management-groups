UM.prototype.umAddGroupHelpers = {
    groupschema: function () {
        //return Schemas.group;
    },
    groups: function(){
        return Groups;
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
    save: function () {
        return __('save');
    },
    abort: function () {
        return __('abort');
    }
};
UM.prototype.umAddGroupEvents = {
    'click .fullname': function (e) {
        //yes :P
        var val = $(e.target).html();
        if(this.emails && this.emails[0] && this.emails[0].address){
            val = this.emails[0].address;
        }
        $('#leader').val(val);

    },
    'click .parentGroup': function (e) {
        //yes :P
        var val = $(e.target).html();
        if(this.groupname){
            val = this.groupname;
        }
        $('#parentGroupName').val(val);
    }
};
