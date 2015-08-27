Security.permit(['insert', 'update', 'remove'])
  .collections([Groups])
  .ifHasRole('admin')
  .apply();
