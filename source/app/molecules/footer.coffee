class App.Molecule.Footer extends Atomic.Molecule

  @type: "Footer"
  @template: """
    <footer>
        <nav data-children-container="navigation"></nav>
    </footer>
  """

  render: ->
    super
    @el[0].addEventListener "touchmove", (e) -> e.preventDefault()
