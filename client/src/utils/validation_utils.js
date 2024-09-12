// KOMMENTTI: Aika monesta alla olevista validointifunktioista voisi tehdä yksinkertaisempia esim.:
// export const validateString = (maybeString) => typeof maybeString === 'string'
// export const validateInteger = (maybeInteger) => Number.isInteger(maybeInteger)
// export const validateNumber = (maybeNumber) => Number.isFinite(maybeNumber)

const validateString = (data) => {
  let isString = true

  if (data === undefined || typeof data !== 'string') {
    isString = false
  }

  return isString
}

const validateInteger = (data) => {
  let isInteger = true

  if (data === undefined || Number.isInteger(data) !== true) {
    isInteger = false
  }

  return isInteger
}

const validateNumber = (data) => {
  let isFloat = true

  // KOMMENTTI: Number.isFinite(data) voi olla varmempi, koska esim. typeof Infinity === 'number'
  if (data === undefined || typeof data !== 'number') {
    isFloat = false
  }

  return isFloat
}

const validateRarityClass = (data) => {
  const rarityClasses = ['common', 'uncommon', 'rare', 'mythic']
  let isRarityClass = true

  if (data === undefined || typeof data !== 'string' || rarityClasses.includes(data) === false) {
    isRarityClass = false
  }

  return isRarityClass
}

const validateManaCost = (data) => {
  let isManaCost = true

  if (data === undefined || typeof data !== 'string' || isValidManaCost(data) === false) {
    isManaCost = false
  }

  return isManaCost
}

const isValidManaCost = (data) => {
  let isValidManaCost = true

  const manaCostAsArray = data.split(' ')

  if (manaCostAsArray.length === 1 && isLandNumberColorOrX(data) === false) {
    isValidManaCost = false
  } else if (manaCostAsArray.length > 1) {
    isValidManaCost = isValidManaCostStructure(manaCostAsArray)
  }

  return isValidManaCost
}

const isValidManaCostStructure = (data) => {
  let isValidStructure = true
  const seen = {
    number: false,
    color: false
  }

  for (let i = 0; i < data.length; i++) {
    const part = data[i]

    if (part === 'x') {
      if (isBeforeNumberOrColor(seen) === false) {
        isValidStructure = false
      }
    } else if (validateInteger(Number((part))) === true) {
      if (seen.number === true || isBeforeColor(seen) === false) {
        isValidStructure = false
      }
      seen.number = true
    } else if (isColor(part) === true) {
      seen.color = true
    } else {
      isValidStructure = false
    }

    if (isValidStructure === false) {
      break
    }
  }
  return isValidStructure
}

const isBeforeNumberOrColor = (seen) => {
  let isBefore = true

  if (seen.number !== false) {
    isBefore = false
  } else if (seen.color !== false) {
    isBefore = false
  }

  return isBefore
}

const isBeforeColor = (seen) => {
  let isBefore = true

  if (seen.color === true) {
    isBefore = false
  }

  return isBefore
}

const isLandNumberColorOrX = (data) => {
  let oneOfThem = false

  if (data === '') {
    oneOfThem = true
  } else if (isColor(data) === true) {
    oneOfThem = true
  } else if (validateInteger(Number(data)) === true) {
    oneOfThem = true
  } else if (data === 'x') {
    oneOfThem = true
  }

  return oneOfThem
}

const isColor = (data) => {
  let color = false
  const manaColors = ['black', 'blue', 'green', 'red', 'white']

  if (manaColors.includes(data)) {
    color = true
  }

  return color
}

const isEmptyString = (string) => {
  let emptyString = true

  if (string.trim().length > 0) {
    emptyString = false
  }

  return emptyString
}

export {
  validateString,
  validateInteger,
  validateNumber,
  validateRarityClass,
  validateManaCost,
  isEmptyString
}