App =

  Atom      : {}
  Molecule  : {}
  Organism  : {}
  Template  : {}

  init      : (json_path) ->
    Atomic.Loader.loadJson json_path, (app) =>
      App.Cache.init app.structure
      body = $$(document.body)
      component.render(body) for component in app.structure
      App.Router.init(app.startRoute)
