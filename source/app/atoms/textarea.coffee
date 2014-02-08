class App.Atom.Textarea extends Atomic.Atom

  @type: "Textarea"
  @template: """
    <textarea class="{{class}}"></textarea>
  """

  value: -> @el.val()
