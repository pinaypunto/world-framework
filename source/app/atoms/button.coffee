class App.Atom.Button extends @Atomic.Atom

  @type: "Button"
  @template: """
    <button class="{{class}}">
        <span class="icon {{icon}}"></span>
        {{text}}
    </button>
  """


  constructor: (attributes, children, options) ->
    super
    if options?.router then @_checkRouter(options.router)

  _checkRouter: (route) ->
    parts = route.split ":"
    @el.bind "tap", -> App.Router[parts[0]](parts[1])
