colors =
  '00' : ['white']
  '01' : ['black']
  '02' : ['blue', 'navy']
  '03' : ['green']
  '04' : ['red']
  '05' : ['brown', 'maroon']
  '06' : ['purple', 'violet']
  '07' : ['orange', 'olive']
  '08' : ['yellow']
  '09' : ['lightgreen', 'lime']
  '10' : ['teal', 'bluecyan']
  '11' : ['lightcyan', 'cyan', 'aqua']
  '12' : ['lightblue', 'royal']
  '13' : ['pink', 'lightpurple', 'fuchsia']
  '14' : ['grey']
  '15' : ['lightgrey', 'silver']

styles =
  '\\x00' : 'normal'
  '\\x01' : 'underline'
  '\\x02' : 'bold'
  '\\x16' : 'italic'


# make functions for bg colors
bgColorFuncs = {}
for i, colorArr of colors
  for color in colorArr
    bgColorFuncs[color] = ((i) ->
      (str) ->
        str.charAt(1) + ',' + i + str.substr(1)
    )(i)


# make color functions for both foreground and background
funcs = {}
c = '\\x03'
for i, colorArr of colors
  fg = ((i) ->
    (str) ->
      "#{c}#{i}#{str}#{c}"
  )(i)
  bg = ((i) ->
    (str) ->
      pos = str.indexOf c
      if pos is -1
        "#{c}01,#{i}#{str}#{c}"
      else
        "#{str.substr(pos, c.length + 2)},#{i}#{str}#{c}"
  )(i)

  for color in colorArr
    funcs[color] = fg
    funcs['bg' + color = bg

# style functions
funcs = {}
for c, style of styles
  funcs[style] = ((c) ->
    (str) ->
      "#{c}#{str}#{c}"
  )(c)

# extra functions
funcs.rainbow = (str) ->
  rainbowColors = ['red', 'orange', 'yellow', 'green',
                   'lightblue', 'navy', 'violet']
  i = 0
  s = ''
  for c in str.split('') when c isnt ' '
    s += colorFuncs[rainbowColors[i++ % rainbowColors.length]] c
  s


# add bgColors to colors
for fg, colorF of colorFuncs
  for bg, bgF of bgColorFuncs
    colorFuncs[fg][bg] = ((bgF, colorF) ->
      (str) ->
        bgF colorF str
    )(bgF, colorF)

# add styles and extras to both colors and background
for obj in [colorFuncs, bgColorFuncs]
  for color, colorF of obj
    for addingObj in [styleFuncs, extraFuncs]
      for style, styleF of addingObj
        obj[color][style] = ((styleF, colorF) ->
          (str) ->
            styleF colorF str
        )(styleF, colorF)

# add colors to styles
for style, styleF of styleFuncs
  for color, colorF of colorFuncs
    styleFuncs[style][color] = ((styleF, colorF) ->
      (str) ->
        colorF styleF str
    )(styleF, colorF)

# main object
# add all functions to it
module.exports = c = {}
for obj in [colorFuncs, styleFuncs, extraFuncs]
  for name, f of obj
    c[name] = ((f) ->
      f
    )(f)

console.log c.blue.white 'time'
console.log c.blue 'blue'
console.log c.bold 'bold'
console.log c.bold.grey 'bold grey'
console.log c.green.underline 'green underline'
console.log c.bold.white.black 'bold white black'
console.log c.white.black.italic 'white black italic'
