var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['groupname'];

SubGroupSearch = new SearchSource('groups', fields, options);