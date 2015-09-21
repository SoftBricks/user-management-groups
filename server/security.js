Groups.permit(['insert', 'update', 'remove'])
  .ifHasRole('admin')
  .apply();

Groups.permit(['insert', 'update', 'remove'])
  .ifHasRole('superAdmin')
  .apply();
