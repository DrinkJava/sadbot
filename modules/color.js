const INVALID = 'INVALID';
var colors = {
  'red': '#ff3b30',
  'orange': '#ff9500',
  'yellow': '#ffcc00',
  'green': '#4cd964',
  'teal': '#47778d',
  'blue': '#007aff',
  'purple': '#5856d6',
  'pink': '#ff2d55',
  'grey': '#95a5a6',
  'white': '#95a5a6',
  'black': '#333333',
  'mango': '#FF7056',
  'rose gold': '#e0929e',
  'space grey': '#4f5b66',
  'gold': '#D9B650'
};
var currColor;

function handleColor(color, threadID, api) {
  if (color == 'list') {
    var list = '```\nBuilt-in colors:\n\n';
    for (var c in colors) {
      list += c;
      list += ' '.repeat(15-c.length);
      list += colors[c];
      list += '\n';
    }
    api.sendMessage(list, threadID);
    return INVALID;
  } else if(color == '++') {
    return shadeColor(currColor, .25);
  } else if(color == '--') {
    return shadeColor(currColor, -.25);
  }
  // Get color from color object
  if (colors[color]) {
    return colors[color];
  }
  // #XXX hex format
  if (color.startsWith('#') && color.length == 4 && !isNaN(color.charAt(1))) {
    var colorCode = color.charAt(1).repeat(6);
    return '#' + colorCode;
  }
  // No valid color -- sadboi
  return INVALID;
}

function trigger(color, api, message) {
  threadID = message.threadID;
  api.getThreadInfo(threadID, function(error, info) {
    currColor = info['color'];
    // 7 is length of valid hex #XXXXXX
    if (!color.startsWith('#') || color.length != 7) {
      color = handleColor(color.toLowerCase(), threadID, api);
    }
    if (color && color != INVALID) {
      api.changeThreadColor(color, threadID, function(err) {
        if (err) return console.error(err);
      });
    }
  });
}

function shadeColor(myColor, percent) {   
    var f=parseInt(myColor.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
module.exports = {
  trigger: trigger
}
