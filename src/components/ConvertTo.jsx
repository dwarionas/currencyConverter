import React from 'react';

const ConvertTo = ({ currenciesList, setCurrencies, activeCurrency }) => {
    return (
        <select onChange={(e) => setCurrencies(e)} value={activeCurrency}>
            {currenciesList &&
                currenciesList.map((item) => (
                    <option key={item.cc} value={item.txt}>
                        {`${item.cc} (${item.txt})`}
                    </option>
                ))}
        </select>
    );
};

export default ConvertTo;
