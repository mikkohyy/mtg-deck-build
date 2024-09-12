import { useReducer } from 'react'
import createCardSetReducer from '../reducers/createCardSetReducer'

const useCreateCardSet = () => {
  // KOMMENTTI: Tämän voisi luoda hookin ulkopuolella
  const initialState = {
    name: '',
    description: '',
    cards: undefined,
    keyNames: undefined,
    fieldNames: {
      name: '',
      price: '',
      rarity: '',
      cardNumber: '',
      manaCost: '',
      rulesText: ''
    }
  }

  const [newCardSetState, newCardSetDispatch] = useReducer(createCardSetReducer, initialState)

  const getFieldNamesAsArray = () => {
    // KOMMENTTI:
    // Object.entries().map():llä saisi nätin onelinerin jolloin
    // ei tarvitsisi väliaikaisia muuttujia eikä [].push:ia
    let fieldNamesArray = []

    for (const [key, value] of Object.entries(newCardSetState.fieldNames)) {
      fieldNamesArray.push(`${key}: ${value}`)
    }

    return fieldNamesArray
  }

  // KOMMENTTI: Olisipa tämä typescriptiä :D
  const getCardSetObject = () => {
    const cards = newCardSetState.cards.length > 0
      ? getCardsCombinedWithExpectedKeyNames()
      : []

    const cardSetObject = {
      name: newCardSetState.name,
      description: newCardSetState.description,
      cards: cards
    }

    return cardSetObject
  }

  const getCardsCombinedWithExpectedKeyNames = () => {
    // KOMMENTTI: Tässäkin voisi käyttää Array.map:iä `newCardSetState.cards.map((card) => getCard...KeyNames(card))`
    const cards = []

    for (const card of newCardSetState.cards) {
      const createdCard = getCardDataCombinedWithExpectedKeyNames(card)
      // KOMMENTTI: Ei tarvetta spreadaukselle, kun getCardDataCombinedWithExpectedKeyNames palauttaa uuden objecktin
      cards.push({ ...createdCard })
    }

    return cards
  }

  const getCardDataCombinedWithExpectedKeyNames = (card) => {
    // KOMMENTTI: Tässä voisi käyttää Array.reduce:a, mutta ihan ok näinkin.
    let createdCard = {}

    for (const [key, keyInData] of Object.entries(newCardSetState.fieldNames)) {
      createdCard[key] = card[keyInData]
    }

    return createdCard
  }

  return {
    getFieldNamesAsArray,
    getCardSetObject,
    newCardSetState,
    newCardSetDispatch // KOMMENTTI: Tekisin tässäkin selkeät metodit dispatchin palauttamisen sijaan, mutta kyllä tämä näinkin toimii
  }
}

export default useCreateCardSet