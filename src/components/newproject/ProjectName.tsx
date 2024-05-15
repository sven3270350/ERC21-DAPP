import { Input } from "../ui/input"
import { Label } from "../ui/label"

export const ProjectName = () => {
    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold text-white text-center mb-2">Project Name</h2>
            <p className="text-[#71717A] text-sm font-medium text-center mb-4">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam</p>
            <div>
                <Label className="text-[#A1A1AA] text-sm">Name</Label>
                <Input className="bg-[#18181B] border-[#27272A] mt-2 text-[#F57C00]" placeholder="Example..." />
            </div>
        </div>
    )
}
