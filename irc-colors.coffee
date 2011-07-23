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


# make color functions
colorFuncs = {}
for i, colorArr of colors
  for color in colorArr
    colorFuncs[color] = (str) ->
      "\x03#{i}#{str}\x03"

# make functions for bg colors
bgColorFuncs = {}
for i, colorArr of colors
  for color in colorArr
    bgColorFuncs[color] = (str) ->
      str.charAt(1) + ',' + i + str.substr(1)


styles =
  '\x00' : 'normal'
  '\x01' : 'underline'
  '\x02' : 'bold'
  '\x16' : 'italic'

# style functions
styleFuncs = {}
for c, style of styles
  styleFuncs[style] = (str) ->
    "#{c}#{str}#{c}"


# extra functions
extraFuncs =
  rainbow: (str) ->
    rainbowColors = ['red', 'orange', 'yellow', 'green',
                     'blue', 'lightblue', 'violet']
    i = 0
    s = ''
    for c in str.split('') when c isnt ' '
      s += colorFuncs[rainbowColors[i++ % rainbowColors.length]] c
    s


# add bgColors to colors
for fg of colorFuncs
  for bg, f of bgColorFuncs
    fg[bg] = f

# add styles and extras to both colors and background
for obj in [colorFuncs, bgColorFuncs]
  for color of obj
    for addingObj in [styleFuncs, extraFuncs]
      for style, f of addingObj
        obj[color][style] = f


# main object
# add all functions to it
module.exports = irc = {}
for obj in [colorFuncs, styleFuncs, extraFuncs]
  for name, f of obj
    irc[name] = f

