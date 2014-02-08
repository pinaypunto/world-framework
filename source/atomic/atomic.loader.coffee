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
      attributes = component.attributes or {}
      children = parseStructure(component.children or [])
      if App[component.type][component.name]
        instance = new App[component.type][component.name](attributes, children, component)
        classes.push instance
      else
        console.error "Atom.#{component.type}.#{component.name} not found"
    return classes


  loadJson        : loadJson
  parseStructure  : parseStructure
