if (Meteor.isServer) {
    Meteor.methods({
        /*
         * checks if a given groupname is already existing in the database
         * @param String groupname
         * @return Boolean
         *      true = groupname is existing
         *      false = groupname not existing
         */
        checkGroupnameExisting: function (groupname) {
            var existingGroupname = Groups.find({groupname: groupname}).fetch();
            if (existingGroupname.length > 0)
                return true;

            return false;
        },
        /*
         * checks if a given leader really exists in the user database
         * @param String leader
         * @return Boolean
         *      true = leader is existing
         *      false = leader not existing
         */
        leaderExisting: function (leader) {
          //TODO check leader existing
        },
        /*
         * checks if a given agency really exists in the database
         * @param String agency
         * @return Boolean
         *      true = agency is existing
         *      false = agency not existing
         */
        agencyExisting: function (agency) {
            //TODO check leader existing
        }
    });
}