Meteor.publish('<%= name %>', function (/* args */) {
  return <%= collection %>.find();
});
