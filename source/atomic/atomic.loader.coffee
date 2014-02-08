Atomic.Loader = do ->

  loadJson = (path, callback) ->
    $$.ajax
      url       : path
      dataType  : "json"
      error     : -> throw "Error loading app strcture json in #{path}"
      success   : (appJson) ->
        appJson = JSON.parse(appJson.response)
        app = {}
        app[attr] = value for attr, value of appJson when attr isnt "structure"
        app.structure = parseStructure(appJson.structure)
        console.log "Loaded #{path} :: ", app
        callback.call callback, app

  parseStructure = (components) ->
    classes = []
    for component in components
      attributes  = component.attributes or {}
      children    = parseStructure(component.children or [])
      options     = component.options or {}
      if App[component.type][component.name]
        classes.push _createItem(component.type, component.name, attributes, children, options)
      else
        console.error "Atom.#{component.type}.#{component.name} not found"
    return classes

  _createItem = (type, name, attributes, children, options) ->
    new App[type][name](attributes, children, options)


  loadJson        : loadJson
  parseStructure  : parseStructure
