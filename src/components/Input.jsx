import React from 'react';

const Input = ({ debounceInput, input }) => {
    return (
        <input
            onChange={debounceInput}
            defaultValue={input}
            className="converter__sum--input"
            type="number"
            placeholder="Sum"
        />
    );
};

export default Input;
