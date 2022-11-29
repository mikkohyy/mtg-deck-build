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
import Login from './Login'
import { getAllCardSets } from '../services/card_sets'

const MainLayout = styled.div`
  width: 95%;
  height: 95%;
  margin: auto;
  display: flex;
  flex-direction: column;
  border: solid 3px lightgrey;
`

const MainContainer = () => {
  const { notificationIsVisible } = useContext(notificationContext)
  const { cardSetsDispatch } = useContext(CardSetsContext)

  useEffect(() => {
    const getCardSets = async () => {
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
      <MainLayout>
        { notificationIsVisible === false
          ? null
          : <NotificationContainer />
        }
        <AppNavigation />
        <Routes>
          <Route path='/builder' element={<DeckBuilder />} />
          <Route path='/tester' element={<DeckTester />} />
          <Route path='/' element={<Login />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default MainContainer