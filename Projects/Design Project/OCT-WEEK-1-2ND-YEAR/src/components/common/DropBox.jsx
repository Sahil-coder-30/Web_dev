import React from 'react'
import Shuffle from './Shuffle'

const DropBox = () => {
    return (
        <div className='w-full h-full relative group'>
            <div className='w-full h-full relative bg-black '>
                {/* <div className='w-[40%] h-[1px] z-20 group-hover:bg-black absolute transition-all duration-250 top-[40%] right-[20%] bg-white'></div>
            <div className='w-[30%] h-[1px] z-20 group-hover:bg-black absolute transition-all duration-250 top-[60%] right-[20%] bg-white'></div> */}
                <div className='w-full text-center absolute z-40 group-hover:text-black transition-all duration-100'>
                    <Shuffle
                        text="MENU BAR"
                        shuffleDirection="right"
                        duration={0.5}
                        animationMode="evenodd"
                        shuffleTimes={1}
                        ease="power3.out"
                        stagger={0.03}
                        threshold={0.1}
                        triggerOnce={true}
                        triggerOnHover={true}
                        respectReducedMotion={true}
                    />
                </div>
            </div>
            <div className='w-full h-[0%] group-hover:h-full transition-all duration-250 top-0 absolute bg-green-200'>

            </div>

        </div>
    )
}

export default DropBox