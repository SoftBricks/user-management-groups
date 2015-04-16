Package.describe({
  name: 'softbricks:user-management-groups',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');

  api.use('softbricks:user-management@0.0.1');
  api.imply('softbricks:user-management');

  api.use(['templating'], 'client');
  api.use(['mongo'], ['client', 'server']);

  api.use(['aldeed:simple-schema@1.3.0']);
  api.imply('aldeed:simple-schema');
  api.use(['aldeed:collection2@2.3.2']);
  api.imply('aldeed:collection2');
  api.use('stevezhu:lodash@3.6.0');
  api.imply('stevezhu:lodash');
  api.use('meteorhacks:search-source@1.2.0');
  api.imply('meteorhacks:search-source');

  api.addFiles(['lib/schemaGroup.js','collections/groups.js','lib/utils.js'], ['client','server']);
  api.addFiles(['server/publications.js'], 'server');
  api.addFiles(['server/methods.js'], 'server');
  api.addFiles(['lib/searchLeader.js','lib/searchSubGroup.js','lib/templates/showGroups.js'], 'client');
  api.addFiles(['lib/templates/groupListItem.js','lib/templates/showGroup.js','lib/templates/editGroup.js',
    'lib/templates/addGroup.js'],'client');
  api.addFiles(['server/searchLeader.js','server/searchSubGroup.js'], 'server');

  api.export(['Groups','GroupsPages', 'LeaderSearch', 'SubGroupSearch'], ['client', 'server']);

});

//Package.onTest(function(api) {
//  api.use('tinytest');
//  api.use('softbricks:user-management');
//  api.addFiles('softbricks:user-management-tests.js');
//});
