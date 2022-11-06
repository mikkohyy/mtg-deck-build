const BasicValidator = require('../utils/basic_validator')

describe('BasicValidator', () => {
  describe('checkIfString()', () => {
    describe('returns true', () => {
      test('if string', () => {
        const data = 'this is a string'
        const validationResult = BasicValidator.checkIfString(data)

        expect(validationResult).toBe(true)
      })
    })
    describe('returns false', () => {
      test('if undefined', () => {
        const data = undefined
        const validationResult = BasicValidator.checkIfString(data)

        expect(validationResult).toBe(false)
      })
      test('if an object', () => {
        const data = { string: 'this is not' }
        const validationResult = BasicValidator.checkIfString(data)

        expect(validationResult).toBe(false)
      })
    })
  })
  describe('checkIfArray()', () => {
    describe('returns true', () => {
      test('if an array', () => {
        const data = [1, 2, 3]
        const validationResult = BasicValidator.checkIfArray(data)
        expect(validationResult).toBe(true)
      })
    })
    describe('returns false', () => {
      test('if undefined', () => {
        const data = undefined
        const validationResult = BasicValidator.checkIfArray(data)

        expect(validationResult).toBe(false)
      })

      test('if an object', () => {
        const data = { data: 'this is a string' }
        const validationResult = BasicValidator.checkIfArray(data)

        expect(validationResult).toBe(false)
      })
    })
  })
  describe('checkIfFloat()', (() => {
    describe('returns true', () => {
      test('if literal float', () => {
        const data = '3.18'
        const validationResult = BasicValidator.checkIfFloat(data)

        expect(validationResult).toBe(true)
      })
      test('if implicit float', () => {
        const data = '3'
        const validationResult = BasicValidator.checkIfFloat(data)

        expect(validationResult).toBe(true)
      })
    })
    describe('returns false', () => {
      test('if undefined', () => {
        const data = undefined
        const validationResult = BasicValidator.checkIfFloat(data)

        expect(validationResult).toBe(false)
      })

      test('if not a number', () => {
        const data = 'this is not a number'
        const validationResult = BasicValidator.checkIfFloat(data)

        expect(validationResult).toBe(false)
      })

      test('if mix of numbers and characters', () => {
        const data = '2 things'
        const validationResult = BasicValidator.checkIfFloat(data)

        expect(validationResult).toBe(false)
      })
    })
  }))
  describe('checkIfInteger()', () => {
    describe('returns true', () => {
      test('if integer', () => {
        const data = '4'
        const validationResult = BasicValidator.checkIfInteger(data)

        expect(validationResult).toBe(true)
      })
    })
    describe('returns false', () => {
      test('if undefined', () => {
        const data = undefined
        const validationResult = BasicValidator.checkIfInteger(data)

        expect(validationResult).toBe(false)
      })

      test('if a string', () => {
        const data = 'this is a string'
        const validationResult = BasicValidator.checkIfInteger(data)

        expect(validationResult).toBe(false)
      })

      test('if mix of numbers and characters', () => {
        const data = '2 things'
        const validationResult = BasicValidator.checkIfInteger(data)

        expect(validationResult).toBe(false)
      })

      test('if a float', () => {
        const data = '3.45'
        const validationResult = BasicValidator.checkIfInteger(data)

        expect(validationResult).toBe(false)
      })
    })
  })

  describe('checkIfRarityClass()', () => {
    describe('returns true', () => {
      test('if \'common\'', () => {
        const data = 'common'
        const validationResult = BasicValidator.checkIfRarityClass(data)

        expect(validationResult).toBe(true)
      })

      test('if \'uncommon\'', () => {
        const data = 'uncommon'
        const validationResult = BasicValidator.checkIfRarityClass(data)

        expect(validationResult).toBe(true)
      })

      test('if \'rare\'', () => {
        const data = 'rare'
        const validationResult = BasicValidator.checkIfRarityClass(data)

        expect(validationResult).toBe(true)
      })

      test('if \'mythic rare\'', () => {
        const data = 'mythic rare'
        const validationResult = BasicValidator.checkIfRarityClass(data)

        expect(validationResult).toBe(true)
      })
    })
    describe('returns false', () => {
      test('if undefined', () => {
        const data = undefined
        const validationResult = BasicValidator.checkIfRarityClass(data)

        expect(validationResult).toBe(false)
      })

      test('if not a string', () => {
        const data = 2
        const validationResult = BasicValidator.checkIfRarityClass(data)

        expect(validationResult).toBe(false)
      })

      test('if not a rarity class', () => {
        const data = 'very uncommon'
        const validationResult = BasicValidator.checkIfRarityClass(data)

        expect(validationResult).toBe(false)
      })
    })
  })

  describe('checkIfDate()', () => {
    describe('return true', () => {
      test('if a Date object', () => {
        const data = new Date(2022, 11, 20, 19, 37, 15, 23)
        const validationResult = BasicValidator.checkIfDate(data)

        expect(validationResult).toBe(true)
      })
      test('if string representation of a date', () => {
        const data = '2021-12-24T10:20:12.002Z'
        const validationResult = BasicValidator.checkIfDate(data)

        expect(validationResult).toBe(true)
      })
    })
    describe('returns false', () => {
      test('if undefined', () => {
        const data = undefined
        const validationResult = BasicValidator.checkIfDate(data)

        expect(validationResult).toBe(false)
      })
    })
  })
  describe('checkIfBoolean()', () => {
    describe('returns true', () => {
      test('if false', () => {
        const data = false
        const validationResult = BasicValidator.checkIfBoolean(data)

        expect(validationResult).toBe(true)
      })
      test('if true', () => {
        const data = true
        const validationResult = BasicValidator.checkIfBoolean(data)

        expect(validationResult).toBe(true)
      })
    })
    describe('returns true', () => {
      test('if undefined', () => {
        const data = undefined
        const validationResult = BasicValidator.checkIfBoolean(data)

        expect(validationResult).toBe(false)
      })
      test('if a string', () => {
        const data = 'false'
        const validationResult = BasicValidator.checkIfBoolean(data)

        expect(validationResult).toBe(false)
      })
    })
  })
  describe('checkIfModifiedCardsObject()', () => {
    describe('returns true', () => {
      test('if modified cards object', () => {
        const data = {
          added: [],
          deleted: [],
          updated: []
        }
        const validationResult = BasicValidator.checkIfModifiedCardsObject(data)

        expect(validationResult).toBe(true)
      })
    })
    describe('returns false', () => {
      test('if undefined', () => {
        const data = undefined
        const validationResult = BasicValidator.checkIfModifiedCardsObject(data)

        expect(validationResult).toBe(false)
      })
      test('if an object with properties \'added\' and \'updated\'', () => {
        const data = {
          added: [],
          updated: []
        }
        const validationResult = BasicValidator.checkIfModifiedCardsObject(data)

        expect(validationResult).toBe(false)
      })
      test('if an array of objects', () => {
        const data = [ { added: 'this is invalid' }, { deleted: 'this is invalid' } ]
        const validationResult = BasicValidator.checkIfModifiedCardsObject(data)

        expect(validationResult).toBe(false)
      })
    })
  })
})