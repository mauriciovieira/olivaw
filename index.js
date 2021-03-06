var assert = require('assert')

module.exports = Olivaw

function Olivaw (opts) {
  assert.equal(typeof opts, 'object', 'olivaw: opts should be type Object')

  var neighbourhoods = [ '111', '110', '101', '100', '011', '010', '001', '000' ]

  // need some automata accessible variables
  var automata = null
  var rule = typeof opts.rule === 'number' ? opts.rule : parseInt(opts.rule)
  var population = opts.population
  var life = opts.life

  assert.equal(typeof population, 'number', 'olivaw: population should be type Number')
  assert.equal(typeof rule, 'number', 'olivaw: rule should be type Number')
  assert.equal(typeof life, 'number', 'olivaw: life should be type Number')

  return {
    set: set
  }

  // create automata lattice based on size (population of cells) provided
  // _run over a set population of a given life
  function set () {
    var lattice = []

    // clear automata array
    automata = []
    lattice = _setState(lattice, population)
    lattice = _setNeighbours(lattice)
    rule = _getRulesBinary(rule)
    automata.push(lattice)
    automata = _run()

    return automata
  }

  // get a random state and create all cells
  function _setState (lattice, size) {
    for (var num = 0; num < size; num++) {
      var cell = {}
      cell.state = getRandomState()
      lattice.push(cell)
    }

    return lattice
  }

  function _setNeighbours (lattice) {
    return lattice.map(function (cell, index, array) {
      var lastEl = lattice.length - 1

      if (index === 0) {
        cell.left = lattice[lastEl].state
        cell.right = lattice[index + 1].state

        return cell
      }

      if (index === lastEl) {
        cell.right = lattice[0].state
        cell.left = lattice[index - 1].state

        return cell
      }

      cell.right = lattice[index - 1].state
      cell.left = lattice[index + 1].state

      return cell
    })
  }

  function _run (currentYear) {
    var automaton = automata
    var lastLife = automaton.slice(-1)[0]
    var nextLife = lastLife.map(_nextLife)
    nextLife = _setNeighbours(nextLife)
    automaton.push(nextLife)

    if (!currentYear) currentYear = 0
    if (currentYear < life) _run(++currentYear)

    return automaton
  }

  function _nextLife (cell, index) {
    var hood = _getNeighbours(cell.state, cell.right, cell.left)
    var currentRule = _getRule(hood)

    return {
      state: currentRule
    }
  }

  function _getNeighbours (cell, right, left) {
    var current = []
    current.push.apply(current, [right, cell, left])
    var currentHood = current.join('')

    return currentHood
  }

  // let's see which rule we are currently looking at
  function _getRule (neighbourhood) {
    var currentState = null
    var currentRule = [...rule]
    neighbourhoods.forEach(function (hood, index) {
      if (hood === neighbourhood) {
        currentState = currentRule[index]
      }
    })

    return currentState
  }

  // determine rules for a given lattice
  function _getRulesBinary (num) {
    // let's convert a number to an 8-bit bae
    var binaryRule = ('000000000' + parseInt(num, 10).toString(2)).substr(-8)

    return binaryRule
  }
}

function getRandomState () {
  return Math.random() > 0.5 ? 1 : 0
}
