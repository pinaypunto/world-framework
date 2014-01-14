class @Input extends WorldCore.Item
  template: """
    <input type="{{type}}" style="width:100%" name="{{name}}" value="{{value}}" placeholder="{{placeholder}}"/>
  """

  events:
    "keyup": "onKeyup"

  validate: ->
    if @el.val().trim() is ""
      @el.val("")
      return false
    return true

  onKeyup: =>
    @trigger "keyup"