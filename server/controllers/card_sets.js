const cardSetsRouter = require('express').Router()
const { CardSet, Card } = require('../models')
const { extractInformationOnUpdatedObject } = require('../utils/query_handling')
const {
  validateNewCardSetObject,
  validateIdWhichIsInteger,
  validateUpdatedCardSetObject
} = require('../utils/validation_middleware')

cardSetsRouter.get('/', async (request, response, next) => {
  try {
    const foundSets = await CardSet.findAll()
    response.json(foundSets)
  } catch(error) {
    next(error)
  }
})

cardSetsRouter.get('/:id', validateIdWhichIsInteger, async (request, response, next) => {
  const cardSetId = request.params.id
  try {
    const foundSet = await CardSet.findOne({
      where: { id: cardSetId },
      include: {
        model: Card
      }
    })

    if (didCardSetWithIdExist(foundSet) === true) {
      response.json(foundSet)
    } else {
      response.status(404).end()
    }
  } catch(error) {
    next(error)
  }
})

cardSetsRouter.post('/', validateNewCardSetObject, async (request, response, next) => {
  try {
    const { cards, ...userInfo } = request.body
    const newCardSet = { ...userInfo, date: new Date() }
    const addedCardSet = await CardSet.create(newCardSet)

    let addedCards = []

    if (didCardSetHaveCards(cards) === true) {
      const cardsWithCardSetId = addCardSetIdToCards(cards, addedCardSet.id)
      const returnedCards = await Card.bulkCreate(cardsWithCardSetId, { validate: true })
      addedCards = extractCardsFromQueryResult(returnedCards)
    }

    const addedCardSetWithAddedCards =  {
      ...addedCardSet.dataValues,
      cards: addedCards
    }

    response.status(201).json(addedCardSetWithAddedCards)
  } catch(error) {
    next(error)
  }
})

cardSetsRouter.delete('/:id', validateIdWhichIsInteger, async (request, response, next) => {
  try {
    const cardSetId = request.params.id
    const rowsDestroyed = await CardSet.destroy({ where: { id: cardSetId } })

    if (wasCardSetDeleted(rowsDestroyed) === true) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  } catch(error) {
    next(error)
  }
})

cardSetsRouter.put(
  '/:id',
  validateIdWhichIsInteger,
  validateUpdatedCardSetObject,
  async (request, response, next) => {
    let updatedObject = undefined

    try {
      const cardSetId = request.params.id
      const { name, description, date, cards } = request.body

      const updateRequestResponse = await CardSet.update(
        {
          name,
          description,
          date
        },
        {
          where: { id: cardSetId },
          returning: true
        }
      )

      if (wasCardSetUpdated(updateRequestResponse)) {
        updatedObject = await createUpdateResponseObject(updateRequestResponse, cards)
        response.status(200).json(updatedObject)
      } else {
        response.status(404).end()
      }

    } catch(error) {
      next(error)
    }
  }
)

const modifyCardsInDb = async (cards) => {
  const { added, deleted, updated } = cards
  const addedCards = await addCardsToDb(added)
  const deletedCards = await deleteCardsFromDb(deleted)
  const updatedCards = await updateCardsInDb(updated)

  const modificationResults = {
    added: addedCards,
    deleted: deletedCards,
    updated: updatedCards
  }

  return modificationResults
}

const addCardsToDb = async (cardsToAdd) => {
  let addedCards = []
  if (cardsToAdd.length > 0) {
    const returnedCards = await Card.bulkCreate(cardsToAdd, { validate: true })
    addedCards = returnedCards.map(card => card.dataValues)
  }

  return addedCards
}

const deleteCardsFromDb = async (cardsToDelete) => {
  let nOfDeletedCards = 0

  if (cardsToDelete.length > 0) {
    const cardIds = cardsToDelete.map(card => card.id)
    nOfDeletedCards = await Card.destroy({ where: { id: cardIds } })
  }

  return nOfDeletedCards
}

const updateCardsInDb = async (cardsToUpdate) => {
  let updatedCards = []

  if (cardsToUpdate.length > 0) {
    const columnsToBeUpdated = ['name', 'cardNumber', 'manaCost', 'price', 'rulesText', 'rarity']

    const updateInfo = await Card.bulkCreate(cardsToUpdate, {
      updateOnDuplicate: columnsToBeUpdated
    })
    updatedCards = updateInfo.map(card => card.dataValues)
  }

  return updatedCards
}

const addCardSetIdToCards = (cards, cardSetId) => {
  const cardsWithCardSetId = cards.map(card => ({ ...card, cardSetId: cardSetId }))
  return  cardsWithCardSetId
}

const createUpdateResponseObject = async (requestResponse, cards) => {
  const updateResponse = extractInformationOnUpdatedObject(requestResponse)
  const cardModificationResults = await modifyCardsInDb(cards)

  updateResponse.cards = cardModificationResults

  return updateResponse
}

const didCardSetHaveCards = (cards) => {
  let hadCards = false
  if (cards.length > 0) {
    hadCards = true
  }

  return  hadCards
}

const didCardSetWithIdExist = (foundSet) => {
  let setWasFound = false

  if (foundSet !== null) {
    setWasFound = true
  }

  return setWasFound
}

const extractCardsFromQueryResult = (queryResponse) => {
  const returnedCards = queryResponse.map(card => card.dataValues)
  return returnedCards
}

const wasCardSetDeleted = (queryResponse) => {
  let wasDeleted = false

  if (queryResponse > 0) {
    wasDeleted = true
  }

  return wasDeleted
}

const wasCardSetUpdated = (updateQueryResponse) => {
  let wasUpdated = false
  const nOfUpdatedRows = updateQueryResponse[0]

  if (nOfUpdatedRows > 0) {
    wasUpdated = true
  }

  return wasUpdated
}

module.exports = cardSetsRouter