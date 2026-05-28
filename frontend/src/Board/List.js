import React from 'react';

function List({ name, children }) {
  return (
    <div className="rounded-xl bg-gray-100 p-2 mx-2 my-5 w-80 shrink-0 grow-0 shadow">
      <div className="px-6 py-1">
        <h2 className="font-bold text-xl my-1">{ name }</h2>
      </div>
      { children }
    </div>
  );
};

export default List;