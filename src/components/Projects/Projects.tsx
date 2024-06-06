import React, { useState } from 'react';
import { Tabs } from './Tabs';
import { AllTabsData } from './AllTabsData';

export const Projects: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<string>("Buy");

    return (
        <div className='p-4'>
            <div>
                <Tabs setSelectedTab={setSelectedTab} />
            </div>
            <AllTabsData selectedTab={selectedTab} />
        </div>
    )
}
