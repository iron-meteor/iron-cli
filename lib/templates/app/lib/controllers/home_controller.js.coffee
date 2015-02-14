HomeController = RouteController.extend(
  layoutTemplate: 'MasterLayout'
  subscriptions: ->
  action: ->
    @render 'Home'
    return
)