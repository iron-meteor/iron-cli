<% if (where === 'client') { -%>
<%= name %> = new Mongo.Collection(null);
<% } else { -%>
<%= name %> = new Mongo.Collection('<%= collectionName %>');
<% } %>

<% if (where !== 'client') { -%>
if (Meteor.isServer) {
  <%= name %>.allow({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });

  <%= name %>.deny({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}
<% } %>
