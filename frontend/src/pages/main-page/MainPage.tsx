import Sidebar from "./SideBar.tsx";
import FileUploader from "../../components/FileUploader.tsx";

const MainPage = () => {

  return (
    <>
      <div className='flex flex-row items-start'>
        <Sidebar />
        <div className="flex-1 p-8 ml-80">
          <FileUploader />
        </div>
      </div>
    </>
  )
}

export default MainPage;
