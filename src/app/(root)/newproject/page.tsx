"use client"
import MultipleSteppes from "@/components/newproject/MultipleSteppes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function newprojecthome() {

    return (
        // <ScrollArea className="w-full h-full overflow-x-auto overflow-y-auto ">
            <div className="w-full bg-[#09090B]">
                <MultipleSteppes />
            </div>
        // </ScrollArea>
    );
}
