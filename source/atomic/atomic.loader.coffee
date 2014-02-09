Atomic.Loader = do ->

  loadJson = (url, callback) ->
    $$.ajax
      url       : url
      dataType  : "json"
      error     : -> throw "Error loading app strcture json in #{url}"
      success   : (appJson) ->
        appJson = JSON.parse(appJson.response)
        app = {}
        app[attr] = value for attr, value of appJson when attr isnt "structure"
        app.structure = []
        app.structure.push(createStructure(root)) for root in appJson.structure
        callback.call callback, app

  createStructure = (item, parent) ->
    attributes = item.attributes or {}
    options = item.options or {}
    instance = new App[item.type][item.name](attributes, [], options)
    if parent then parent.appendChild(instance)
    children = item.children or []
    createStructure(child, instance) for child in children
    return instance


  loadJson        : loadJson
  createStructure : createStructure
