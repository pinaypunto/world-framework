class Atomic.Class extends @World.Item

  constructor: (@attributes={}, @children=[]) ->
    super
    if @constructor.template and @constructor.autorender isnt false
      do @__createElementNode

  ###*
   * [render description]
   * @param  {[type]} container
   * @return {[type]}
  ###
  render: (@container, force=false) ->
    return if @constructor.autorender is false and !force
    if not @el then do @__createElementNode
    @container.append @el
    if @children.length > 0
      default_children_container = @__getDefaultContainer()
      for child in @children
        if child.attributes.container
          child.render(@__getChildContainer__(child.attributes.container))
        else child.render(default_children_container)

  # Private methods
  __createElementNode: ->
    @el = $$ templayed(@constructor.template)(@attributes)
    if @events and @el then for evt, callback of @events
      parts = evt.split(" ")
      el = if parts.length is 1 then @el else @el.find(parts.slice(1).join(" "))
      el.on evt, @[callback]

  __getDefaultContainer: ->
    container = @el.find("[data-children-container]")
    return if container.length then container else @el

  __getChildContainer__: (child_container) ->
    @el.find("[data-children-container=#{child_container}]")

