import React from 'react'
import Video from '../components/home/Video'
import HomeHeroText from '../components/home/HomeHeroText'
import HomeBottomText from '../components/home/HomeBottomText'
import Transition from '../components/common/Transition'

const Home = () => {
    return (
        <div>
            {/* <Transition/> */}
            <div className='h-full w-full fixed'>
                <Video/>
            </div>
            <div className='h-screen w-screen relative'>
                <HomeHeroText/>
                <HomeBottomText/>
            </div>
        </div>
    )
}

export default Home