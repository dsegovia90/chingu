var fccLevels = [
  {
    category: "Front End Development Certification",
    levels: ["Basic Front End Development Projects", "Basic Algorithm Scripting", "Intermediate Front End Development Projects", "Intermediate Algorithm Scripting", "Advanced Algorithm Scripting", "Advanced Front End Development Projects"]
  },
  {
    category: "Data Visualization Certification",
    levels: ["React Projects", "Data Visualization Projects"]
  },
  {
    category: "Back End Development Certification",
    levels: ["API Projects", "Dynamic Web Application Projects"]
  }
];

function printLevel(level) {
  var category = getCategory(level);
  return category + " - " + level;
}

function getCategory(level) {
  for (var i = 0; i < fccLevels.length; i++) {
    if (fccLevels[i].levels.indexOf(level) > -1) {
      return fccLevels[i].category;
    }
  }
  return undefined;
}

function getFccScore(level) {
  var levels = fccLevels.reduce(function(all, curr) {
    return all.concat(curr.levels);
  }, []);
  return levels.indexOf(level);
}

function toLevelsArray() {
  var arr = fccLevels.reduce(function(all, curr) {
    return all.concat(curr.levels.map(function(level) {
      return [curr.category, level];
    }));
  }, []);
  
  return arr;
}

function getLevel(fccScore) {
  var levels = fccLevels.reduce(function(all, curr) {
    return all.concat(curr.levels);
  }, []);
  return printLevel(levels[fccScore]);
}

module.exports.levels = fccLevels;
module.exports.toLevelsArray = toLevelsArray;
module.exports.getLevel = getLevel;
module.exports.getFccScore = getFccScore;
