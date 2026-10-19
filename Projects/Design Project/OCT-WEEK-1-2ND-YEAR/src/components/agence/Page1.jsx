import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { useRef } from 'react'

const Page1 = () => {

    const ImageDivRef = useRef(null)
    const Imageref = useRef(null)
    const ImageArray = [
        '/public/resources/images/Carl_480x640.jpg',
        'public/resources/images/CAMILLE_480X640_2.jpg',
        'public/resources/images/ChantalG_480x640.jpg',
        'public/resources/images/Claire_480x640.jpg',
        'public/resources/images/HugoJoseph_480x640.jpg',
        'public/resources/images/joel_480X640_3.jpg',
        'public/resources/images/Lawrence_480x640.jpg',
        'public/resources/images/MAXIME_480X640_2.jpg',
        'public/resources/images/MEGGIE_480X640_2.jpg',
        'public/resources/images/MEL_480X640.jpg',
        'public/resources/images/Michele_480X640 (1).jpg',
        'public/resources/images/MyleneS_480x640.jpg',
        'public/resources/images/Olivier_480x640.jpg',
        'public/resources/images/SophieA_480x640.jpg'

    ]
    gsap.registerPlugin(ScrollTrigger)

    useGSAP(function () {
        gsap.to(ImageDivRef.current, {
            scrollTrigger:{

                trigger:ImageDivRef.current,
                // markers:true,
                start:"top 31%",
                end:"top -80%",
                pin:true,
                scrub:true,
                onUpdate:(elem) =>{
                    let image_index = Math.floor(elem.progress * ImageArray.length);
                    if(image_index <= 13){
                        Imageref.current.src = ImageArray[image_index];
                    }
                    else{
                        Imageref.current.src = ImageArray[13];
                    }
                    // console.log(Imageref.current.src = ImageArray[Math.floor(elem.progress * ImageArray.length)]);
                    // console.log(Math.floor(elem.progress * ImageArray.length));
                    
                    
                }
            }
        })
    })




    return (
        <div className='h-[100vw] w-screen'>
            <div ref={ImageDivRef} className="absolute top-[18vw] left-[30vw] w-[15vw] h-[20vw] rounded-4xl overflow-hidden ">
                <img ref={Imageref} className='w-full h-full' src="/public/resources/images/Carl_480x640.jpg" alt="" />
            </div>
            <div>
                <div className="main_text absolute top-[32vw] w-full font-[font2] text-black text-[20vw] text-center ">
                    <span className='block leading-[18vw]'>
                        SEVEN7Y
                    </span>
                    <span className='block leading-[18vw]'>
                        TWO
                    </span>
                </div>
                <div className='text-black absolute w-[60vw] leading-tight h-[30vw] font-extrabold font-[font2] uppercase text-[2.7vw] top-[68vw] right-0 '>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Were inquisitive and open-minded, and we make sure creativity crowds out ego from every corner. A brand is a living thing, with values, a personality and a story. If we ignore that, we can achieve short-term success, but not influence that goes the distance. We bring that perspective to every brand story we help tell.</p>
                </div>
            </div>
        </div>
    )
}

export default Page1