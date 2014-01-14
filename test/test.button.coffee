
class @Button extends WorldCore.Item

  template: """<button type="{{type}}">{{text}}</button>"""

  events: "click": "onClick"

  onClick: (event) =>
    event.preventDefault()
    @trigger "click"

  disable: ->
    @el.attr "disabled", "disabled"

  enable: ->
    @el.removeAttr "disabled"


class @SubmitButton extends Button

  constructor: (@attributes, @childs=[]) ->
    @attributes.type = "submit"
    super
