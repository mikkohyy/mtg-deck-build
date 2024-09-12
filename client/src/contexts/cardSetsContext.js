import { createContext, useReducer } from 'react'
import cardSetsReducer from '../reducers/cardSetsReducer'

const CardSetsContext = createContext(undefined)

const CardSetsProvider = ({ children }) => {
  const [cardSetsState, cardSetsDispatch] = useReducer(cardSetsReducer, [])

  // KOMMENTTI:
  // Reducerin dispatch on ihan jees sellaisenaan, mutta jatkokehityksen kannalta voisi olla kätevää
  // luoda providerille omat metodit. Eli jos jossain kohtaa päätät vaihtaa reducerin johonkin muuhun. esim:
  //
  // const addCardSet = useCallback((newCardSet) => {
  //   cardSetsDispatch({
  //     type: 'ADD_CARD_SET',
  //     payload: newCardSet
  //   })
  // }, [cardSetsDispatch])
  //
  // jne.

  return (
    <CardSetsContext.Provider value={{ cardSetsState, cardSetsDispatch }}>
      {children}
    </CardSetsContext.Provider>
  )
}

// KOMMENTTI:
// Itse tykkään kovasti tehdä providereille hookit esim.
// export const useCardSets = () => {
//   const context = useContext(CardSetsContext)
//
//   if (!context) {
//     throw new Error('useCardSets can be used only inside a CardSetsProvider')
//   }
//
//   return context
// }

// KOMMENTTI:
// Useammin törmännyt nimeämiskäyntäntöön jossa tiedosto nimetään providerin mukaan esim. src/providers/CardSetsProvider.js
// ja default exporttina itse provider. Context exportataan sitten nimettynä.
export { CardSetsContext, CardSetsProvider }
