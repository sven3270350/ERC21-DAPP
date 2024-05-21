import * as React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { saveProjectData, getProjectData } from "@/app/utils/utils";

interface ProjectNameProps {
    setIsValid: (isValid: boolean) => void;
    triggerValidation: boolean;
    setProjectName: (name: string) => void;
}

export const ProjectName: React.FC<ProjectNameProps> = ({ setIsValid, triggerValidation, setProjectName }) => {
    const [projectName, setLocalProjectName] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");

    // Function to validate the project name
    const validate = (value: string): boolean => {
        if (value.trim() === "") {
            setError("Project name is required.");
            setIsValid(false);
            return false;
        } else {
            setError("");
            setIsValid(true);
            return true;
        }
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        setLocalProjectName(value);
        setProjectName(value);
        validate(value);
    };

    React.useEffect(() => {
        const data = getProjectData();
        if (data.projectName) {
            setLocalProjectName(data.projectName);
            setProjectName(data.projectName);
            setIsValid(true); 
        }
    }, []);

    React.useEffect(() => {
        if (triggerValidation) {
            if (validate(projectName)) {
                saveProjectData('projectName', projectName);
            }
        }
    }, [triggerValidation]);

    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold text-white text-center mb-2">Project Name</h2>
            <p className="text-[#71717A] text-sm font-medium text-center mb-4">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            </p>
            <div>
                <Label className="text-[#A1A1AA] text-sm">Name</Label>
                <Input
                    className="bg-[#18181B] border-[#27272A] mt-2 text-[#F57C00]"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={handleInputChange}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        </div>
    );
};
