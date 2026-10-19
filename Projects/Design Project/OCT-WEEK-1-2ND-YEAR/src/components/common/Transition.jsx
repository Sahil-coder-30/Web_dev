import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useRef } from 'react'

const Transition = () => {
    const TransitionRef = useRef(null)

    useGSAP(function(){
        let tl = gsap.timeline();
        tl.to(TransitionRef,{
            display:'block'
        })
        tl.to('.stair',{
            display:'block'
        })
        tl.from('.stair',{
            height:0,
            delay:0.5,
            duration:0.5,
            stagger:{
                amount:-0.3
            }
            
        })
        tl.to('.stair',{
            y:'100%',
            delay:0.5,
            duration:0.5,
            stagger:{
                amount:-0.3
            }
        })
        tl.to('.stair',{
            display:'none'
        })
        gsap.to(TransitionRef,{
            display:'none'
        })
        tl.to(TransitionRef,{
            y:'0%'
        })
    })
    
  return (
    <div ref={TransitionRef} className='w-screen h-screen flex'>
        <div  className='stair w-1/5 h-full bg-black '>
        </div>
        <div  className='stair w-1/5 h-full bg-black '>
        </div>
        <div  className='stair w-1/5 h-full bg-black '>
        </div>
        <div  className='stair w-1/5 h-full bg-black '>
        </div>
        <div  className='stair w-1/5 h-full bg-black '>
        </div>
        <div  className='stair w-1/5 h-full bg-black '>
        </div>
    </div>
  )
}

export default Transition