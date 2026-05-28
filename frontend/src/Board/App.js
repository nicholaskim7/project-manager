import React from 'react';
import Drag from '../Drag';

function Card({ title, description, dragItem }) {
  return (
    <div className={`rounded-lg bg-white border border-gray-300 shadow-sm p-4 m-2 ${dragItem ? 'opacity-50' : ''}`}>
      <h3 className="font-bold text-lg my-1">{ title }</h3>
      {/* Renders the description if it exists, otherwise renders the fallback text */}
      <p className="text-secondary">{ description || "No description provided." }</p>
    </div>
  );
};

function List({ name, children, dragItem }) {
  return (
    <div 
      className={`rounded-xl bg-gray-100 p-2 mx-2 my-5 shadow select-none d-flex flex-column ${dragItem ? 'opacity-50' : ''}`}
      // This style forces the lists to share space equally, never get too thin, and stay tall when empty
      style={{ flex: 1, minWidth: '280px', minHeight: '500px' }}
    >
      <div className="px-3 py-2 border-bottom mb-2">
        <h4 className="fw-bold m-0">{ name }</h4>
      </div>
      {/* This wrapper ensures the drop zone stretches the full height of the empty list */}
      <div className="flex-grow-1 d-flex flex-column">
        { children }
      </div>
    </div>
  );
};

// app component
function App({ initialData }) {
  const [data, setData] = React.useState(initialData);

  // handle a dropped item
  function handleDrop({ dragItem, dragType, drop }) {
    if (dragType === "card") {
      let [newListPosition, newCardPosition] = drop.split("-").map((string) => parseInt(string));
      let newData = structuredClone(data); 
      
      let oldCardPosition;
      let oldListPosition = data.findIndex((list) => {
        oldCardPosition = list.cards.findIndex((card) => card.id === dragItem);
        return oldCardPosition >= 0;
      });

      let card = data[oldListPosition].cards[oldCardPosition];

      if (newListPosition === oldListPosition && oldCardPosition < newCardPosition) {
        newCardPosition--; 
      }

      newData[oldListPosition].cards.splice(oldCardPosition, 1);
      newData[newListPosition].cards.splice(newCardPosition, 0, card);

      setData(newData);

    } else if (dragType === "list") {
      let newListPosition = drop;
      let oldListPosition = data.findIndex((list) => list.id === dragItem);
      
      let newData = structuredClone(data);
      let list = data[oldListPosition];

      if (oldListPosition < newListPosition) {
        newListPosition--;
      }

      newData.splice(oldListPosition, 1);
      newData.splice(newListPosition, 0, list);

      setData(newData);
    }
  };

  return (
    <div className="d-flex flex-column w-100">
      <Drag handleDrop={handleDrop}>
        {({ activeItem, activeType, isDragging }) => (
            <Drag.DropZone dropId="board" dropType="list" className="d-flex justify-content-between flex-nowrap align-items-start overflow-auto w-100">
                {data.map((list, listPosition) => {
                    return (
                        <React.Fragment key={list.id}>
                        <Drag.DropZone dropId={listPosition} dropType="list" remember={true}>
                            <Drag.DropGuide dropId={listPosition} dropType="list" className="rounded-xl bg-gray-200 mx-2 my-5" style={{ flex: 1, minWidth: '280px', minHeight: '500px' }} />
                        </Drag.DropZone>
                        <Drag.DropZones className="d-flex flex-column h-100" style={{ flex: 1, minWidth: '280px' }} prevId={listPosition} nextId={listPosition+1} dropType="list" split="x" remember={true}>
                            <Drag.DragItem dragId={list.id} className={`cursor-pointer ${activeItem === list.id && activeType === "list" && isDragging ? "d-none" : ""}`} dragType="list">
                            <List name={list.name} dragItem={activeItem === list.id && activeType === "list"}>
                                {data[listPosition].cards.map((card, cardPosition) => {
                                return (
                                    <Drag.DropZones key={card.id} prevId={`${listPosition}-${cardPosition}`} nextId={`${listPosition}-${cardPosition+1}`} dropType="card" remember={true}>
                                    <Drag.DropGuide dropId={`${listPosition}-${cardPosition}`} className="rounded-lg bg-gray-200 m-2" style={{ height: '100px' }} dropType="card" />
                                    <Drag.DragItem dragId={card.id} className={`cursor-pointer ${activeItem === card.id && activeType === "card" && isDragging ? "d-none" : ""}`} dragType="card">
                                        
                                        <Card 
                                          title={card.title || "Untitled Task"} 
                                          description={card.description} 
                                          dragItem={activeItem === card.id && activeType === "card"} 
                                        />
                                        
                                    </Drag.DragItem>
                                    </Drag.DropZones>
                                );
                                })}
                                <Drag.DropZone dropId={`${listPosition}-${data[listPosition].cards.length}`} dropType="card" remember={true} className="flex-grow-1">
                                <Drag.DropGuide dropId={`${listPosition}-${data[listPosition].cards.length}`} className="rounded-lg bg-gray-200 m-2" style={{ height: '100px' }} dropType="card" />
                                </Drag.DropZone>
                            </List>
                            </Drag.DragItem>
                            <Drag.DropZone dropId={`${listPosition}-${data[listPosition].cards.length}`} className="flex-grow-1" dropType="card" remember={true} />
                        </Drag.DropZones>
                        </React.Fragment>
                    );
                })}
            <Drag.DropZone dropId={data.length} dropType="list" remember={true}>
              <Drag.DropGuide dropId={data.length} dropType="list" className="rounded-xl bg-gray-200 mx-2 my-5" style={{ flex: 1, minWidth: '280px', minHeight: '500px' }} />
            </Drag.DropZone>
          </Drag.DropZone>
        )}
      </Drag>
    </div>
  );
};

export default App;