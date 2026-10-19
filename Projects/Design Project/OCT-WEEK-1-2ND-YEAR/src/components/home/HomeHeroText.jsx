import React from 'react'
import Video from './Video'
const HomeHeroText = () => {
    return (
        <div className='font-[font1] pt-10'>
            <div className='uppercase leading-[8vw] text-center   text-[9.5vw]  flex justify-center items-center'>The spark for</div>
            <div className='uppercase leading-[8vw] text-center text-[9.5vw] flex justify-center items-center '>
                <div className='inline-block'>
                    all
                </div>
                <div className='h-[8vw] w-[20vw] rounded-[10vw] overflow-hidden inline-block -mt-5'>
                    <Video />
                </div>
                <div className='inline-block'>
                    things
                </div>
            </div>
            <div className='uppercase leading-[8vw] flex justify-center items-center text-[9.5vw] '>creative</div>
        </div>
    )
}

export default HomeHeroText