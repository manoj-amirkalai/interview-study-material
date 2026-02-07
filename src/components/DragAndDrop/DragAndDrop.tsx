import { useState } from "react";
import "./DragAndDrop.css";

const DragAndDrop = () => {
  const [list1, setList1] = useState(["item1", "item2", "item3", "item4"]);
  const [list2, setList2] = useState<string[]>(["", ""]);
  const [list3, setList3] = useState<string[]>(["", ""]);

  const [draggedItem, setDraggedItem] = useState<{
    draggedFrom: "list1" | "list2" | "list3" | "";
    draggedValue: string;
    draggedIndex: number;
  }>({ draggedFrom: "", draggedValue: "", draggedIndex: -1 });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleDrop = (
    targetList: "list1" | "list2" | "list3",
    index: number
  ) => {
    if (!draggedItem.draggedFrom) return;
    function removeList(listdata: string[], i: number) {
      return listdata.map((data: string, key: number) =>
        i === key ? "" : data
      );
    }
    // Remove from original list
    if (draggedItem.draggedFrom === "list1")
      setList1(removeList(list1, draggedItem.draggedIndex));
    if (draggedItem.draggedFrom === "list2")
      setList2(removeList(list2, draggedItem.draggedIndex));
    if (draggedItem.draggedFrom === "list3")
      setList3(removeList(list3, draggedItem.draggedIndex));

    function addToList(listdata: string[], value: string, i: number) {
      return listdata.map((data: string, key: number) =>
        i === key ? value : data
      );
    }
    // Add to target list
    if (targetList === "list1")
      setList1((prev) => addToList(prev, draggedItem.draggedValue, index));
    if (targetList === "list2")
      setList2((prev) => addToList(prev, draggedItem.draggedValue, index));
    if (targetList === "list3")
      setList3((prev) => addToList(prev, draggedItem.draggedValue, index));

    setDraggedItem({ draggedFrom: "", draggedValue: "", draggedIndex: 0 });
  };

  const renderList = (
    list: string[],
    listName: "list1" | "list2" | "list3"
  ) => (
    <div className="drag-container">
      <h2>{listName.replace("list", "List ")}</h2>
      {list.map((item, index) => (
        <div
          key={`${item} ${index}`}
          className={item ? "drag-item" : "drag-item drag-no-item"}
          draggable={!!item}
          onDragOver={handleDragOver}
          onDrop={() => {
            if (!item) handleDrop(listName, index);
          }}
          onDragStart={() =>
            setDraggedItem({
              draggedFrom: listName,
              draggedValue: item,
              draggedIndex: index,
            })
          }
        >
          {item ? item : "Drag & Drop"}
        </div>
      ))}
    </div>
  );

  return (
    <div className="drag-page">
      <h1 className="drag-title">Drag & Drop Feature</h1>
      <div className="drag-lists">
        {renderList(list1, "list1")}
        {renderList(list2, "list2")}
        {renderList(list3, "list3")}
      </div>
    </div>
  );
};

export default DragAndDrop;
