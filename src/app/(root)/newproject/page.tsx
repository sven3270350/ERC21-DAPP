"use client"
import MultipleSteppes from "@/components/newproject/MultipleSteppes";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function newprojecthome() {

    return (
            <div className="w-full h-full bg-[rgb(9,9,11)] overflow-y-auto ">
                <MultipleSteppes />
            </div>
    );
}
