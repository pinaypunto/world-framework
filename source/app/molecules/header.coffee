class App.Molecule.Header extends Atomic.Molecule

  @type: "Header"
  @template: """
    <header>
        <h1>{{title}}</h1>
        <nav class="left" data-children-container="left"></nav>
        <nav class="right" data-children-container="right"></nav>
    </header>
  """

  render: ->
    super
    @el[0].addEventListener "touchmove", (e) -> e.preventDefault()
    buttons = @children.filter (item) -> item.namespace is "Button"
    for button in buttons
      if button.visibleOnSection
        button.el.attr "data-show-section", button.visibleOnSection
      if button.hiddenOnSection
        button.el.attr "data-hide-section", button.hiddenOnSection

