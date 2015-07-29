Router.route('<%= routePath %>', {
  name: '<%= name %>',
  controller: '<%= controller %>',
  where: '<%= where %>'<% if (action !== 'action') { %>,
  action: '<%= action %>'<% } %>
});
