import React from 'react'
import {
  useSelector,
} from 'react-redux'
import useSubscription from '@logux/redux/use-subscription'

export const User = ({ userId }) => {

  // Hook to subscribe for channel during component render and unsubscribe
  const isSubscribing = useSubscription([`user/${userId}`])

  //const user = useSelector(state => state.users[userId])

  return userId
}
