import {type FC, useState} from "react";
import {CirclePlus, TextCursorInput} from 'lucide-react';
interface CategoryCardProps {
  name: string;
  keywords: string[];
}
const CategoryCard: FC<CategoryCardProps> = ({name, keywords}) => {
  const [editMode, setEditMode] = useState( false);

  const handleKeyWordAdd = () => {
    setEditMode(!editMode);
  }

  return (
    <>
      <div className="flex flex-col my-4">
        <div className="flex flex-row items-start">
          <h3 className="mx-2 w-[20%] text-primary text-lg font-medium">{name}</h3>
          <p className="flex flex-row flex-wrap w-[80%]">
          {
            keywords.map((word) => {
              return (
                <span className="py-1 px-2 border border-body-text rounded-lg m-1 w-fit h-fit flex flex-row justify-between cursor-pointer hover:bg-red-200">
                  <span className="text-md text-anomaly font-medium">{word}</span>
                </span>
              )
            })
          }
            <span className="ml-1 cursor-pointer self-center">
              {editMode
                ? (<TextCursorInput onClick={handleKeyWordAdd} />)
                : (<CirclePlus className="w-8 h-8 text-primary" onClick={handleKeyWordAdd}/>)
              }
            </span>
          </p>
        </div>
      </div>
    </>
  )
}

export default CategoryCard;