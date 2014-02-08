class App.Atom.Select extends Atomic.Atom

  @type: "Select"
  @template: """
    <select name="{{name}}" class="{{class}}" id="{{id}}">
        {{#options}}
            <option value="{{value}}">{{label}}</option>
        {{/options}}
    </select>
  """

  constructor: ->
    super
    if @attributes.value then @el.val(attributes.value)

  value: -> @el.val()
