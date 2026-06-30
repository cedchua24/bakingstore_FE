import React from 'react'
import moment from 'moment'
import { Navigate } from 'react-router-dom'

const Home = () => {
    const today = moment().format('YYYY-MM-DD')

    return <Navigate to={`/shopOrderTransaction/customerOrderTransactionList/${today}`} replace />
}

export default Home
