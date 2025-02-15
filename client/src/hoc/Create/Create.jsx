import "./Create.css";
import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import CreateSidebar from "./CreateHeader/CreateHeader";
import CreatePanels from "./CreatePanels/CreatePanels";

const Create = () => {
  return (
    <div className="create__wrapper relative overflow-hidden">
      <TabGroup className={"w-full flex bg-white"}>
        <CreateSidebar />
        <CreatePanels />
      </TabGroup>
    </div>
  );
};

export default Create;
