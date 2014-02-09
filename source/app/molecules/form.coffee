class App.Molecule.Form extends Atomic.Molecule

  @type     : "Form"
  @template : """
    <form class="{{class}}" id="{{id}}" onsubmit="return false;">
      <h1>{{title}}</h1>
    </form>
  """

  constructor: ->
    super
    submit_attributes = text: "Submit", class: "big fluid accept"
    @submit = new App.Atom.Button(submit_attributes)
    @appendChild @submit
    @submit.el.bind "tap", (e) => console.log @value()

  onSubmit: (callback) ->
    @submit.el.bind "tap", (e) => callback.call @, @value()

  value: ->
    values = {}
    for child in @children when child.value?
      values[child.attributes.name] = child.value()
    return values
