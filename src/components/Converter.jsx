import React from 'react';

import axios from 'axios';
import debounce from 'lodash.debounce';

import Input from './Input';
import ConvertTo from './ConvertTo';
import ConvertFrom from './ConvertFrom';

const Converter = () => {
    const [currenciesList, setCurrenciesList] = React.useState([]);
    const [activeCurrency, setActiveCurrency] = React.useState('');
    const [input, setInput] = React.useState(1.00);
    const [result, setResult] = React.useState(0);
    const [isReverse, setReverse] = React.useState(false);

    React.useEffect(() => {
        const getData = async () => {
            const { data } = await axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');

            setCurrenciesList(data);

            const checkCurrency = localStorage.getItem('ActiveCurrency');
            checkCurrency ? setActiveCurrency(checkCurrency) : setActiveCurrency(data[0].txt);

            const checkReverse = localStorage.getItem('isReverse');
            switch (checkReverse) {
                case 'false':
                    setReverse(true);
                    break;
                case 'true':
                    setReverse(false);
                    break;
                default:
                    setReverse(false);
            }
        };

        getData();
    }, [activeCurrency]);

    const setCurrencies = (e) => {
        if (currenciesList) {
            setActiveCurrency(e.target.value);
            localStorage.setItem('ActiveCurrency', e.target.value);
            calc();
        }
    };

    const reverse = () => {
        setReverse((prev) => !prev);
        localStorage.setItem('isReverse', isReverse);
    };

    const debounceInput = React.useCallback(
        debounce((e) => {
            setInput(e.target.value);
        }, 250), [],
    );

    const calc = () => {
        if (activeCurrency) {
            const activeCurrencyPrice = currenciesList.filter((item) => item.txt === activeCurrency)[0].rate;

            const result = isReverse ? input / activeCurrencyPrice : input * activeCurrencyPrice;
            setResult(result.toFixed(2));
        }
    };

    React.useEffect(() => {
        calc();
    }, [input, activeCurrency, isReverse]);

    return (
        <div className="converter flex justify-center">
            <div className="converter__sum">
                <div className="converter__sum--text">Sum</div>
                <Input debounceInput={debounceInput} input={input} />
            </div>

            <div className="converter__from">
                <div className="sum__text">From currency</div>

                {isReverse ? (
                    <ConvertFrom />
                ) : (
                    <ConvertTo
                        setCurrencies={setCurrencies}
                        currenciesList={currenciesList}
                        activeCurrency={activeCurrency}
                    />
                )}
            </div>

            <button onClick={reverse} className="reverse">
                reverse
            </button>

            <div className="converter__to">
                <div className="sum__text">To currency</div>

                {!isReverse ? (
                    <ConvertFrom />
                ) : (
                    <ConvertTo
                        setCurrencies={setCurrencies}
                        currenciesList={currenciesList}
                        activeCurrency={activeCurrency}
                    />
                )}
            </div>

            <div className="result">{result}</div>
        </div>
    );
};

export default Converter;
