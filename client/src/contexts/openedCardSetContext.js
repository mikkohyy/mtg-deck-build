import { createContext, useState } from 'react'

const OpenedCardSetContext = createContext(undefined)

const OpenedCardSetProvider = ({ children }) => {
  const [openedCardSet, setOpenedCardSet] = useState(undefined)
  return(
    <OpenedCardSetContext.Provider value={{ openedCardSet, setOpenedCardSet }}>
      {children}
    </OpenedCardSetContext.Provider>
  )
}

// KOMMENTTI: samat exporttehin ja hookkeihin liittyvät kommentit kuin CardSetsProviderista

export { OpenedCardSetProvider, OpenedCardSetContext }