import React from 'react'
import {Link} from 'react-router-dom'
const HomeBottomText = () => {
  return (
    <div className='w-full flex justify-center'>
        <footer className='flex absolute  gap-6 bottom-0'>
            <Link className="hover:border-green-300 hover:text-green-300 leading-[4vw] pt-2 font-[font2] text-center text-[4vw] px-4 uppercase rounded-full border-white border-3" to='/projects'>
            Projects
            </Link>
            <Link className="hover:border-green-300 hover:text-green-300 leading-[4vw] pt-2 font-[font2] text-center text-[4vw] px-4 uppercase rounded-full border-white border-3" to='/agence'>
            Agence
            </Link>
        </footer>
    </div>
  )
}

export default HomeBottomText