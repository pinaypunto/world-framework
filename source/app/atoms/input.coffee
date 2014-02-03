class App.Atom.Input extends @Atomic.Atom

  @type: "Input"
  @template: """
    <input type="{{type}}" placeholder="{{placeholder}}" class="{{class}}" name="{{name}}" />
  """

  value: -> @el.val()
