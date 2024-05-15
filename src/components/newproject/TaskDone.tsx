import Image from "next/image"
import { Button } from "../ui/button"

export const TaskDone = () => {
    return (
        <div>
            <div className="text-center">
                <Image
                    src={"./Images/New Project/task-done 1.svg"}
                    width={150}
                    height={140}
                    alt="logo"
                    className="cursor-pointer mb-4 m-auto"
                />
                <h2 className="text-xl font-semibold text-white text-center mb-4">Done!</h2>
                <p className="text-[#71717A] text-sm font-medium text-center mb-6">You successfully created wallets</p>
                <Button className="bg-[#F57C00] text-black text-base font-bold flex gap-2 hover:bg-[#F57C00] w-[180px] m-auto" >
                    Start Execute
                    <Image
                        src={"./Images/New Project/arrow-right-02.svg"}
                        width={18}
                        height={18}
                        alt="logo"
                        className=""
                    />
                </Button>
            </div>
        </div>
    )
}
