class @Form extends WorldCore.Item

  template: """
    <fieldset>
      <legend>{{name}}</legend>
      <form data-childs-container="true"></form>
    </fieldset>
  """

  listenFor:
    "SubmitButton:click"    : "onSubmit"
    "Button:click"          : "onButtonClick"
    "Input:keyup"           : "onKeyup"

  constructor: ->
    super
    submitButton = new SubmitButton({text:"Submit me!"})
    @appendChilds [submitButton]

  onButtonClick: (e) ->
    console.log "FormButton #{e.caller.attributes.text}"

  onSubmit: =>
    valid = true
    for child in @childs when child.validate?
      unless child.validate()
        valid = false
        break
    console.debug "Is valid Form --> #{valid}"
    @tunnel "valid"
    valid

  onKeyup: (e) ->
    console.log "Keyup :: ", e
