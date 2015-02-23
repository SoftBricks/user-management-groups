SearchSource.defineSource('groups', function(searchText, options) {
    var options = {sort: {isoScore: -1}, limit: 20};

    if(searchText) {
        var regExp = buildRegExp(searchText);
        var selector = {groupname: regExp};
        var search = Groups.find(selector, options).fetch();
        return search;
    } else {
        return [];//Groups.find({}, options).fetch();
    }
});

function buildRegExp(searchText) {
    var parts = searchText.trim().split(' ');
    return new RegExp("(" + parts.join('|') + ")", "ig");
}