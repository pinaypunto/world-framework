@Contacts = Contacts = do ->

  App.Extends =
    Atom      : {}
    Molecule  : {}
    Organism  : {}
    Template  : {}


  $$ ->
    console.log "Ready to go!"
    new App.Extends.Template.List()


  List    : null
  Contact : null
  Form    : null
