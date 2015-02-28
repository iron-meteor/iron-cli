<% if (where === 'client') { -%>
@<%= name %> = new Mongo.Collection(null)
<% } else { -%>
@<%= name %> = new Mongo.Collection('<%= collectionName %>')
<% } %>

<% if (where !== 'client') { -%>
if Meteor.isServer
  <%= name %>.allow
    insert: (userId, doc) ->
      false
    update: (userId, doc, fieldNames, modifier) ->
      false
    remove: (userId, doc) ->
      false

  <%= name %>.deny
    insert: (userId, doc) ->
      true
    update: (userId, doc, fieldNames, modifier) ->
      true
    remove: (userId, doc) ->
      true
<% } %>
