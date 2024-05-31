import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Sidebarheader() {
    return (
        <div>
            <Link href={"/"} className="flex items-center gap-2 max-sm:gap-2 mt-6 ml-5">
                <Image src={"/box.svg"} alt="logo" width={30} height={35} className="max-sm:w-[30px] max-sm:h-[30px]" />
                <h1 className="text-[18px] font-semibold leading-7">ERC21 Bot</h1>
            </Link>
        </div>
    )
}

export default Sidebarheader