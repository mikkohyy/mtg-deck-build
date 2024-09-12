import styled from 'styled-components'
import { useContext, useEffect } from 'react'
import { notificationContext } from '../contexts/notificationContext'
import { CardSetsContext } from '../contexts/cardSetsContext'
import NotificationContainer from './NotificationContainer'
import AppNavigation from './AppNavigation'
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'
import DeckTester from './DeckTester'
import DeckBuilder from './DeckBuilder'
import FirstPage from './FirstPage'
import SignUp from './SingUp'
import Login from  './Login'
import { getAllCardSets } from '../services/card_sets'

const FullScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const MainContainer = () => {
  const { notificationIsVisible } = useContext(notificationContext)
  const { cardSetsDispatch } = useContext(CardSetsContext)

  useEffect(() => {
    // KOMMENTTI: Voisiko CardSetsProvider hoitaa tämän itse?
    const getCardSets = async () => {
      // KOMMENTTI: Komponentilla olisi hyvä olla loading tila kunnes tämä on hoidettu
      try {
        const foundCardSets = await getAllCardSets()
        cardSetsDispatch({
          type: 'SET_CARD_SET_LIST',
          payload: foundCardSets
        })
      } catch(error) {
        console.log(error)
      }
    }
    getCardSets()
  }, [])

  return(
    <Router>
      <FullScreenContainer>
        {/* KOMMENTTI: Yleensä mennään truthyn kautta eli `{ notificationIsVisible ? <Notif... /> : null }` */}
        { notificationIsVisible === false
          ? null
          : <NotificationContainer />
        }
        <AppNavigation />
        <Routes>
          <Route path='/builder' element={<DeckBuilder />} />
          <Route path='/tester' element={<DeckTester />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/' element={<FirstPage />} />
        </Routes>
      </FullScreenContainer>
    </Router>
  )
}

export default MainContainer