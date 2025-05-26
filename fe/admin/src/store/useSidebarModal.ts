import { create } from "zustand";

interface SideBarState {
  sidebarStatus: boolean;
  toggleSidebar: () => void;
}

const useSidebarModal = create<SideBarState>((set) => ({
  sidebarStatus: true,
  toggleSidebar: () =>
    set((state) => ({
      sidebarStatus: state.sidebarStatus === true ? false : true,
    })),
}));

export default useSidebarModal;
