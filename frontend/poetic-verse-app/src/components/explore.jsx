import { useState, userRef } from 'react'
import { Poem } from './poem'
import { Icon } from './navbar'
import { Switch } from './loader'

export function Search() {
    return (
        <div>
            <div className='title'>
                <h3>Search</h3>
                <Switch/>
                <div className='searchbar'>
                    <input></input>
                </div>
                <Icon path={'compass-navigator'}/>
            </div>
        </div>
    )
}
