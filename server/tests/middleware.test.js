const { errorHandler, validateSetCardsObject } = require('../utils/middleware')
const { testCardSets, testCards } = require('./test_data')

const validCardSetWithCards = {
  ...testCardSets[0],
  cards: testCards
}

const cardSetWithoutName = {
  description: testCardSets[0].description,
  cards: testCards
}

const cardSetWithoutDescription = {
  name: testCardSets[0].name,
  cards: testCards
}

const cardSetWithoutCardsProperty = {
  ...testCardSets[0]
}

class MockResponse {
  constructor() {
    this.statusValue = null
    this.jsonValue = null
  }

  status(statusCode) {
    this.statusValue = statusCode
    return this
  }

  json(object) {
    this.jsonValue = object
    return this
  }
}

class MockRequest {
  constructor(payload) {
    this.body = payload
  }
}

describe('Error handler responds', () => {
  describe('when SequelizeValidationError', () => {
    test('with status code 400', () => {
      const mockResponse = new MockResponse()

      const error = {
        name: 'SequelizeValidationError',
        message: 'validation failed'
      }

      const response = errorHandler(error, null, mockResponse)

      expect(response.statusValue).toBe(400)
    })

    test('with expected error message', () => {
      const mockResponse = new MockResponse()

      const error = {
        name: 'SequelizeValidationError',
        message: 'validation failed'
      }

      const response = errorHandler(error, null, mockResponse)

      expect(response.jsonValue).toMatchObject({ error: error.message })
    })
  })

  describe('when SequelizeDatabaseError', () => {
    test('with status code 400', () => {
      const mockResponse = new MockResponse()

      const error = {
        name: 'SequelizeValidationError',
        message: 'validation failed'
      }

      const response = errorHandler(error, null, mockResponse)

      expect(response.statusValue).toBe(400)
    })

    test('with expected error message', () => {
      const mockResponse = new MockResponse()

      const error = {
        name: 'SequelizeValidationError',
        message: 'validation failed'
      }

      const response = errorHandler(error, null, mockResponse)

      expect(response.jsonValue).toMatchObject({ error: error.message })
    })
  })
})

describe('Set cards validator', () => {
  test('when set cards is valid does not raise an error and next is called once', () => {
    const mockNext = jest.fn()
    const mockRequest = new MockRequest(validCardSetWithCards)

    validateSetCardsObject(mockRequest, null, mockNext)

    expect(mockNext).toHaveBeenCalledTimes(1)
  })

  describe('when set cards is invalid', () => {
    test('next function is not called', () => {
      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSetWithoutCardsProperty)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        // not doing anything because we testing if next is called
      }

      expect(mockNext).toHaveBeenCalledTimes(0)
    })
  })

  describe('when property "cards" is invalid', () => {
    test('raises InvalidDataError when a string', () => {
      let thrownError

      const cardSet = { cardSetWithoutCardsProperty, cards: 'this is a string' }

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSet)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.name).toBe('InvalidDataError')
    })

    test('raises InvalidDataError when missing', () => {
      let thrownError

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSetWithoutCardsProperty)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.name).toBe('InvalidDataError')
    })

    test('error object has invalidProperties property with array of length 1', () => {
      let thrownError

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSetWithoutCardsProperty)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      const properties = Object.keys(thrownError.invalidProperties)

      expect(thrownError).toBeDefined()
      expect(properties).toHaveLength(1)
    })

    test('error object has invalidProperties property with the item "cards" in it', () => {
      let thrownError

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSetWithoutCardsProperty)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.invalidProperties).toHaveProperty('cards')
    })
  })

  describe('when property "name" is invalid', () => {
    test('raises InvalidDataError when not a string', () => {
      let thrownError

      const cardSet = { ...validCardSetWithCards, name: [] }

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSet)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.name).toBe('InvalidDataError')
    })

    it('raises InvalidDataError when missing', () => {
      let thrownError

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSetWithoutName)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.name).toBe('InvalidDataError')
    })

    test('error object has invalidProperties property with array of length 1', () => {
      let thrownError

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSetWithoutName)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      const properties = Object.keys(thrownError.invalidProperties)

      expect(thrownError).toBeDefined()
      expect(properties).toHaveLength(1)
    })

    test('error object has invalidProperties property with the item "cards" in it', () => {
      let thrownError

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSetWithoutName)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.invalidProperties).toHaveProperty('name')
    })
  })

  describe('when property "description" is invalid', () => {
    test('raises InvalidDataError when not a string', () => {
      let thrownError

      const cardSet = { ...validCardSetWithCards, description: {} }

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSet)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.name).toBe('InvalidDataError')
    })

    test('raises InvalidDataError when missing', () => {
      let thrownError

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSetWithoutDescription)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.name).toBe('InvalidDataError')
    })

    test('error object has invalidProperties property with array of length 1', () => {
      let thrownError

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSetWithoutDescription)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      const properties = Object.keys(thrownError.invalidProperties)

      expect(thrownError).toBeDefined()
      expect(properties).toHaveLength(1)
    })

    test('error object has invalidProperties property with the item "description" in it', () => {
      let thrownError

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSetWithoutDescription)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.invalidProperties).toHaveProperty('description')
    })
  })

  describe('when multiple properties are invalid', () => {
    test('raises InvalidDataError when the wrong type', () => {
      let thrownError

      const cardSet = {
        name: 'this is a string',
        description: {},
        cards: 'this is a string'
      }

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSet)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.name).toBe('InvalidDataError')
    })

    test('raises InvalidDataError when missing', () => {
      let thrownError

      const cardSet = { name: 'this is a string' }

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSet)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.name).toBe('InvalidDataError')
    })

    test('error object has invalidProperties property with array of length 2', () => {
      let thrownError

      const cardSet = {
        name: 'this is a string',
        cards: 'this is a string'
      }

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSet)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      const properties = Object.keys(thrownError.invalidProperties)

      expect(thrownError).toBeDefined()
      expect(properties).toHaveLength(2)
    })

    it('error object has expected invalid properties', () => {
      let thrownError

      const cardSet = {
        name: 'this is a string',
        cards: 'this is a string'
      }

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSet)
      const mockResponse = new MockResponse()

      try {
        validateSetCardsObject(mockRequest, mockResponse, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.invalidProperties).toHaveProperty('description', 'MISSING')
      expect(thrownError.invalidProperties).toHaveProperty('cards', 'INVALID')
    })
  })

  describe('when unnecessary properties', () => {
    test('throws InvalidDataError when object has unnecessary property', () => {
      let thrownError

      const cardSet = { ...validCardSetWithCards }
      cardSet.extra = 'this is extra'

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSet)

      try {
        validateSetCardsObject(mockRequest, null, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.name).toBe('InvalidDataError')
    })

    test('error object has the right information', () => {
      let thrownError

      const cardSet = { ...validCardSetWithCards }
      cardSet.extra = 'this is extra'

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSet)

      try {
        validateSetCardsObject(mockRequest, null, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError.invalidProperties).toHaveProperty('extra', 'UNEXPECTED')
    })

    test('error object has the right information when invalid in all categories', () => {
      let thrownError

      const cardSet = { ...validCardSetWithCards }
      cardSet.extra = 'this is extra'
      cardSet.description = ['this is an array']
      delete cardSet.name

      delete cardSet.cards[3].rulesText
      cardSet.cards[3].cardNumber = 'this is a string'
      cardSet.cards[4].extra = 'this is extra'

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSet)

      try {
        validateSetCardsObject(mockRequest, null, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError.invalidProperties).toHaveProperty('extra', 'UNEXPECTED')
      expect(thrownError.invalidProperties).toHaveProperty('description', 'INVALID')
      expect(thrownError.invalidProperties).toHaveProperty('name', 'MISSING')
      expect(thrownError.invalidProperties).toHaveProperty('cardObjects', 'INVALID')

      expect(thrownError.invalidCards[0]).toHaveProperty('index', '3')
      expect(thrownError.invalidCards[0]).toHaveProperty('rulesText', 'MISSING')
      expect(thrownError.invalidCards[0]).toHaveProperty('cardNumber', 'INVALID')

      expect(thrownError.invalidCards[1]).toHaveProperty('index', '4')
      expect(thrownError.invalidCards[1]).toHaveProperty('extra', 'UNEXPECTED')
    })
  })

  describe('when cards in the card property are invalid', () => {
    test('throws InvalidDataError when one card is missing a property', () => {
      let thrownError

      const cardSet = { ...validCardSetWithCards }
      delete cardSet.cards[0].name

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSet)

      try {
        validateSetCardsObject(mockRequest, null, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError).toBeDefined()
      expect(thrownError.name).toBe('InvalidDataError')
    })

    test('returns expected info about what is invalid when one card is missing a property', () => {
      let thrownError

      const cardSet = { ...validCardSetWithCards }
      delete cardSet.cards[0].name

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(cardSet)

      try {
        validateSetCardsObject(mockRequest, null, mockNext)
      } catch(error) {
        thrownError = error
      }

      const { invalidProperties, invalidCards } = thrownError
      const invalidCardInfo = invalidCards[0]

      expect(invalidProperties).toHaveProperty('cardObjects', 'INVALID')

      expect(invalidCardInfo).toHaveProperty('index', '0')
      expect(invalidCardInfo).toHaveProperty('name', 'MISSING')
    })
  })
})