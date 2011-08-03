colors =
  '00' : ['white']
  '01' : ['black']
  '02' : ['navy']
  '03' : ['green']
  '04' : ['red']
  '05' : ['brown', 'maroon']
  '06' : ['purple', 'violet']
  '07' : ['olive']
  '08' : ['yellow']
  '09' : ['lightgreen', 'lime']
  '10' : ['teal', 'bluecyan']
  '11' : ['cyan', 'aqua']
  '12' : ['blue', 'royal']
  '13' : ['pink', 'lightpurple', 'fuchsia']
  '14' : ['gray', 'grey']
  '15' : ['lightgray', 'lightgrey', 'silver']

styles =
  '\x00' : 'normal'
  '\x01' : 'underline'
  '\x02' : 'bold'
  '\x16' : 'italic'


# main object that will hold all functions
module.exports = funcs = {}

# make color functions for both foreground and background
c = '\x03'
pos2 = c.length + 2
for i, colorArr of colors
  fg = ((i) ->
    (str) ->
      "#{c}#{i}#{str}#{c}"
  )(i)
  bg = ((i) ->
    (str) ->
      pos = str.indexOf c
      if pos isnt 0
        "#{c}01,#{i}#{str}#{c}"
      else
        "#{str.substr(pos, pos2)},#{i}#{str.substr(pos2)}"
  )(i)

  # add function to main object
  for color in colorArr
    funcs[color] = fg
    funcs['bg' + color] = bg


# style functions
for code, style of styles
  funcs[style] = ((code) ->
    (str) ->
      "#{code}#{str}#{code}"
  )(code)

# extra functions
funcs.rainbow = (str) ->
  rainbowColors = ['red', 'olive', 'yellow', 'green',
                   'blue', 'navy', 'violet']
  i = 0
  s = ''
  for c in str.split('') when c isnt ' '
    s += funcs[rainbowColors[i++ % rainbowColors.length]] c
  s


# add all functions to each other
addGetters = (name1, f1) ->
  for name2, f2 of funcs when name1 isnt name2
    f1.__defineGetter__ name2, ((name2, f2) ->
      ->
        newF = (str) ->
          f2 f1 str
        addGetters name2, newF
        newF
    )(name2, f2)

for name1, f1 of funcs
  addGetters name1, f1


# adds functions to global String object
module.exports.global = ->
  t = null
  irc = {}
  String.prototype.__defineGetter__ 'irc', ->
    t = this
    irc

  addGlobalGetters = (name1, f1) ->
    for name2, f2 of funcs when name1 isnt name2
      f1.__defineGetter__ name2, ((name2, f2) ->
        ->
          newF = (str) ->
            f2 f1 t
          addGlobalGetters name2, newF
          newF
      )(name2, f2)

  for name1, f1 of funcs when name1 isnt 'global'
    irc[name1] = ((name1, f1) ->
      newF = ->
        f1 t
      addGlobalGetters name1, newF
      newF
    )(name1, f1)
