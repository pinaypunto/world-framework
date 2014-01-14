
json = [
  {
    'Page':
      title: "Demo page"
      childs: [
        {'Label': text: "Este boton esta fuera del form..."},
        {'Button': text: "Good!"},
        {
          'Form':
            name: 'Hi form 1'
            childs: [
              {'Label': text: "A ver los inputs......"},
              {'Input': placeholder: "Input 1"},
              {'Input': placeholder: "Input 2"},
              {'Input': placeholder: "Input 3"},
              {'Button': text: "Good!"},
              {'Button': text: "Bad!"}
            ]
        },
        {
          'Form':
            name: 'Hi form 2'
            childs: [
              {'Button': text: "Sometimes"},
              {'Button': text: "Allways"}
            ]
        },
        {
          'Form':
            name: 'Hi form 3'
            childs: [
              {'Button': text: "Sometimes"},
              {'Button': text: "Allways"}
            ]
        }
      ]
  },
  {
    'Page': {
      title: "Demo page2"
      childs: [
        {
          'Form':
            name: 'Hi form 1'
            childs: [
              {'Button': text: "Good!"},
              {'Button': text: "Bad!"}
            ]
        },
        {
          'Form':
            name: 'Hi form 2'
            childs: [
              {'Button': text: "Sometimes"},
              {'Button': text: "Allways"}
            ]
        },
        {
          'Form':
            name: 'Hi form 3'
            childs: [
              {'Button': text: "Sometimes"},
              {'Button': text: "Allways"}
            ]
        }
      ]
    }
  }
]

parseJson = (json) ->
  elements = []
  for app_component in json
    for klass, data of app_component
      eval("var element = new #{klass}();")
      element.setAttributes(data)
      if data.childs then element.appendChilds parseJson(data.childs)
    elements.push element
  elements


appStructure = parseJson(json)
element.render($$(document.body)) for element in appStructure




# container = $$ document.body


# start = new Date()
# for i in [0..0]

#   input1 = new Input({
#     name: "input_#{i}"
#     value: ""
#     placeholder: "Insert here something...#{i}"
#   })

#   label1 = new Label({text: "pregunta1"})
#   button1 = new Button({text: "good!"})
#   label2 = new Label({text: "pregunta2"})
#   button2 = new Button({text: "bad..."})
#   form1 = new Form({name: "How are you #{i}?"}, [input1, label1, button1, label2, button2])

#   label3 = new Label({text: "pregunta3"})
#   button3 = new Button({text: "yes"})
#   label4 = new Label({text: "pregunta4"})
#   button4 = new Button({text: "no"})
#   form2 = new Form({name: "Sure? #{i}"}, [label3, button3, label4, button4])

#   page = new Page({title: "Demo page #{i}"}, [form1, form2])
#   page.render(container)


# console.log "Elapsed time :: ", new Date() - start
