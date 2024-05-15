import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"


export const DraftModal = () => {
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-[#09090B] border-none text-[#F57C00] text-sm font-normal">
                        Cancel
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[388px] bg-[#18181B] border-[1px] border-[#3F3F46]" >
                    <DialogHeader>
                        <DialogTitle>
                            <Image
                                src={"./Images/New Project/delete-bin-full 1.svg"}
                                width={150}
                                height={150}
                                alt="logo"
                                className="m-auto"
                            />
                        </DialogTitle>
                        <DialogDescription>
                            <h2 className="text-xl font-semibold text-white text-center mb-4">Do you want to make this draft?</h2>
                            <p className="text-[#71717A] text-sm font-medium text-center mb-4">By drafting you can edit it anytime but by deleting you don’t have access to it anymore</p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button className="bg-[#F44336] bg-opacity-10 text-[#F44336] border-[1px] border-[#F44336] text-base font-bold flex gap-2 w-[90px]">
                            Delete
                        </Button>
                        <Button className="bg-[#F57C00] text-black text-base font-bold flex gap-2 hover:bg-[#F57C00] w-[218px]">
                            Draft
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
