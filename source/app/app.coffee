@App =

  Atom      : {}
  Molecule  : {}
  Organism  : {}
  Template  : {}

  Cache       :
    structure : []


  init      : (json_path) ->
    Atomic.Loader.loadJson json_path, (app) =>
      App.Cache.set(app.structure)
      body = $$ document.body
      component.render(body) for component in app.structure
      App.Router.init(app.startRoute)
