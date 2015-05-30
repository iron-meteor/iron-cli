Meteor.publish('<%= name %>', (/* args */) => {
  return <%= collection %>.find();
});
