"use client"
import MultipleSteppes from "@/components/newproject/MultipleSteppes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function newprojecthome() {

    return (
        <ScrollArea className="w-full h-full overflow-x-auto overflow-y-auto bg-[#09090B]">
            <div className="w-full h-screen">
                <MultipleSteppes />
            </div>
        </ScrollArea>
    );
}
