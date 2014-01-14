class @Page extends WorldCore.Item

  template: """
    <article name="{{name}}">
      <h1>{{title}}</h1>
      <section data-childs-container="true"></section>
    </article>
  """

  listenFor:
    "SubmitButton:click": "onSubmit"
    "Button:click"      : "onButtonClick"

  onSubmit: (e) =>
    console.log "Page #{@attributes.title} Submit #{e.caller.attributes.text}"

  onButtonClick: (e) =>
    console.log "Page #{@attributes.title} Button #{e.caller.attributes.text}"
