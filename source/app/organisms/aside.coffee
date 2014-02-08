class App.Organism.Aside extends Atomic.Organism

  @type: "Aside"
  @template: """
    <aside class="{{class}}" id="{{id}}"></aside>
  """

  activate: ->
    @el.addClass("active")

  deactivate: ->
    @el.removeClass("active")