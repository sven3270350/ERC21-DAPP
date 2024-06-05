import React from 'react'
import { Transfer } from './Transfer/Transfer'
import { Tabs } from './Tabs'

export const Projects = () => {
    return (
        <div className='p-4'>
            <div>
                <Tabs />
            </div>
            <Transfer />
        </div>
    )
}
