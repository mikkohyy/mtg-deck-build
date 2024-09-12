import styled from 'styled-components'
import { useContext } from 'react'
import { notificationContext } from '../contexts/notificationContext'

// KOMMENTTI: Ilman kirjoitusvirhettä tällä olisi sama nimi kuin exportattavalla komponentilla :D
const NofiticationContainer = styled.div`
  ${props => props.theme.components.containers.notificationContainer}
`

// KOMMENTTI: Tämän nimi voisi olla vaan Notification(s)
const NotificationContainer = () => {
  const { notification } = useContext(notificationContext)

  return(
    <NofiticationContainer>
      {notification}
    </NofiticationContainer>
  )
}

export default NotificationContainer