//TODO Currently the same as searchLeader, do we really need a own SearchSource for users in Groups?
SearchSource.defineSource('test', function(searchText, options) {
    var options = {sort: {isoScore: -1}, limit: 20};
    if(searchText) {
        var regExp = buildRegExp(searchText);
        var selector = {$or: [{username: regExp},{'emails.0.address': regExp},{'profile.fullname': regExp}]};
        var search = Meteor.users.find(selector, options).fetch();
        return search;
    } else {
        return [];//Meteor.users.find({}, options).fetch();
    }
});

function buildRegExp(searchText) {
    var parts = searchText.trim().split(' ');
    return new RegExp("(" + parts.join('|') + ")", "ig");
}