import { create } from 'zustand'

type Store = {
    allProjects: any
    setAllProjects: (allProjects: any) => void
}

export const useStore = create<Store>()((set) => ({
    allProjects: [],
    setAllProjects: (allProjects) => set({ allProjects }),
}))