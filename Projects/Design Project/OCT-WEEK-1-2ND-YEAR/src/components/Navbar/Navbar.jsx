import React from 'react'
import TextToSvgComponent from './TextToSvgComponent'
import DropBox from '../common/DropBox'


const Navbar = () => {
    return (
        <div>
            <div className='w-full flex justify-between fixed z-10 top-0'>
                <TextToSvgComponent />
                <div className='w-[15vw] h-[3vw] overflow-hidden flex justify-center items-center '>
                    <DropBox/>
                </div>
            </div>
        </div>
    )
}

export default Navbar