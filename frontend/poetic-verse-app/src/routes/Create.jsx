import React from 'react'
import '../styles/create.css'
import { Icon } from '../components/navbar'

const Create = () => {
  return (
    <>
   <div className="parent">
   <div className="title">
            <h3>Create  </h3>
            <Icon className = 'create-icon' path = 'create' />
        </div>

        <div className="section-2">
            <h3>Verse Title</h3>
            <form action="">
                <input type="text" className='input-1' />
            </form>
        </div>

        <div className="canvas">
            <h3>Poetry Canvas</h3>
            <textarea name="" id="" className='txt-area-1' ></textarea>
        </div>

        <div className="filter-section">
            <h3>Poetry Filters</h3>
            <div className="box">
            <input name="" id="" className='txt-area'></input>
            <button className='btn'>Create</button>  
            </div>
        </div>  
   </div>
    </>
  )
}

export default Create
