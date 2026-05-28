import React from 'react';

function Card({ title, description = "Drag and drop me!" }) {
  return (
    <div className="rounded-lg bg-white border border-gray-300 shadow-sm p-5 m-2">
      <h3 className="font-bold text-lg my-1">{ title }</h3>
      <p>{ description }</p>
    </div>
  );
};

export default Card;