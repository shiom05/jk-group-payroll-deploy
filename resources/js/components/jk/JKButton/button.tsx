import React from "react";

interface buttonProps{
     onClick: ()=> void;
     label: string,
}

const Button = ({onClick, label}:buttonProps) => {
    return (
        <button onClick={onClick} className="mb-10 cursor-pointer! rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700">
           {label}
        </button>
    );

}

export default Button;