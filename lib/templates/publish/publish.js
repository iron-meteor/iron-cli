Meteor.publish('<%= name %>', function () {
  return <%= collection %>.find();
});
