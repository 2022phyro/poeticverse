import { useState, userRef } from 'react'
import { Poem } from './poem'
import { Icon } from './navbar'

export function Search() {
    return (
        <div>
            <div className='title'>
                <h3>Search</h3>
                <Icon path={'compass-navigator'}/>
                <div className='searchbar'>
                    <input></input>
                </div>
                <Poem url='/df'/>
            </div>
        </div>
    )
}
