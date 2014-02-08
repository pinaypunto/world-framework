class App.Atom.Title extends Atomic.Atom

  @type: "Title"
  @template: """
    <h{{size}} class="{{class}}">{{text}}</h{{size}}>
  """

  constructor: ->
    super
