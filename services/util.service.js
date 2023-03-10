export const utilService = {
  getMatches,
  getHashtags,
}

function getMatches(string, regex, index = 1) {
  var matches = []
  var match
  while ((match = regex.exec(string))) {
    matches.push(match[index])
  }
  return matches
}

function getHashtags(str) {
  const hashtagReg = /#([A-Za-z][A-Za-z0-9_]*)/g
  return getMatches(str, hashtagReg, 1)
}
