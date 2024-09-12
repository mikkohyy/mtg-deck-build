import {
  validateString,
  validateInteger,
  validateNumber,
  validateRarityClass,
  validateManaCost
} from  './validation_utils'

// KOMMENTTI: "data":n sijaan voisi käyttää kuvaavampia termejä kuten "name", "price", "rarity"
const validationFunctions = {
  name: (data) => validateString(data),
  price: (data) => validateNumber(data),
  rarity: (data) => validateRarityClass(data),
  cardNumber: (data) => validateInteger(data),
  manaCost: (data) => validateManaCost(data),
  rulesText: (data) => validateString(data)
}

const checkIfCardsHaveSameKeys = (cards) => {
  let previousKeys = undefined
  let haveSameKeys = true

  for (const card of cards) {
    if (previousKeys === undefined) {
      previousKeys = Object.keys(card)
    } else {
      const currentKeys = Object.keys(card)
      if (previousKeys.length !== currentKeys.length) {
        haveSameKeys = false
        break
      }
      const arraysMatch = currentKeys.every((key) => previousKeys.includes(key))
      if (arraysMatch === false) {
        haveSameKeys = false
        break
      }

      previousKeys = [...currentKeys]
    }
  }

  return haveSameKeys
}

const checkIfDataInCardsIsValid = (fieldNames, cards) => {
  let haveValidData = true

  for (const card of cards) {
    if (isCardDataValid(fieldNames, card) === false) {
      haveValidData = false
      break
    }
  }

  return haveValidData
}

const isCardDataValid = (fieldNames, card) => {
  let wasValid = true

  for (const [actualKey, keyInData] of Object.entries(fieldNames)) {
    const dataInCard = card[keyInData]

    if (validationFunctions[actualKey](dataInCard) === false) {
      wasValid = false
      break
    }
  }

  return wasValid
}

export {
  checkIfCardsHaveSameKeys,
  checkIfDataInCardsIsValid,
  isCardDataValid
}