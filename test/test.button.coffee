
class @Button extends WorldCore.Item

  template: """<button type="{{type}}">{{text}}</button>"""

  listenFor:
    "Form:valid": "onValidForm"

  events: "click": "onClick"

  onClick: (event) =>
    event.preventDefault()
    @bubble "click"

  onValidForm: () =>
    console.log "Valid form triggered from button"

  disable: ->
    @el.attr "disabled", "disabled"

  enable: ->
    @el.removeAttr "disabled"


class @SubmitButton extends Button

  constructor: (@attributes, @childs=[]) ->
    @attributes.type = "submit"
    super
