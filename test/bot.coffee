# dependencies
IRC = require 'irc-js'
require('../lib/irc-colors.js').global()

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
  '11' : ['lightcyan', 'cyan', 'aqua']
  '12' : ['blue', 'royal']
  '13' : ['pink', 'lightpurple', 'fuchsia']
  '14' : ['grey']
  '15' : ['lightgrey', 'silver']

irc = new IRC
  server: 'irc.freenode.net'
  encoding: 'utf8'
  nick: 'colortesterbot324324'

chan = '#colortest'
irc.connect ->
  irc.join chan

  msg = ''
  for code, colorArr of colors
    msg += colorArr.join(', ').irc[colorArr[0]].bold() + ' '

  irc.privmsg chan, msg
  irc.privmsg chan, 'rainbow'.irc.rainbow()
  
