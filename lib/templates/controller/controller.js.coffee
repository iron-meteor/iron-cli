@<%= name %>Controller = RouteController.extend(
  subscriptions: ->
  waitOn: ->
  data: ->
  onRun: ->
    @next()
  onRerun: ->
    @next()
  onBeforeAction: ->
    @next()
  action: ->
    @render()
  onAfterAction: ->
  onStop: ->
)
