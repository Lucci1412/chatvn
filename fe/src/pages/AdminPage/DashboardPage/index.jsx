import React from 'react'
import Chart from '../../../components/Admin/Chart'
import FeaturedInfo from '../../../components/Admin/FeaturedInfo'
import './style.css'
function DashBoardPage() {
  return (
    <div style={ {  width: '90%', margin:'50px 5% 0 5% ' }}>
      <FeaturedInfo/>
      <Chart></Chart>
    </div>
  )
}

export default DashBoardPage