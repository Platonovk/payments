import './pay_form.css';
import { Button, Container, TextField } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import axios from 'axios';

// Expiration date format
const DateFormatCustom = React.forwardRef(function DateFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            displayType={'input'}
            format="##/####"
        />
    );
});

DateFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

// Card number format
const CardFormatCustom = React.forwardRef(function CardFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            displayType={'input'}
            format="#### #### #### ####"
        />
    );
});

CardFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

// Main pay form
const PayForm = () => {
    let [cardNumber, setCardNumber] = useState('');
    let [expDate, setExpDate] = useState('');
    let [cvv, setCVV] = useState('');
    let [amount, setAmount] = useState('');

    let [buttonDisabled, setButtonDisabled] = useState(true);

    // Number format
    const handleNumberChange = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            if (e.target.id === 'cvv-input') setCVV(e.target.value);
            else if (e.target.id === 'amount-input') setAmount(e.target.value);
        }
    }

    //Date and card changes handlers
    const handleDateChange = (e) => {
        setExpDate(e.target.value);
    }
    const handleCardChange = (e) => {
        setCardNumber(e.target.value);
    }

    // Check for button activation
    const checkButtonState = () => {
        if (cardNumber.length === 16 && expDate.length === 6 && cvv.length === 3 && amount.length !== 0) setButtonDisabled(false)
        else setButtonDisabled(true);
        return(buttonDisabled);
    }

    const handlePayClick = () => {
        if (!checkButtonState()) axios.post("http://localhost:5000/addCardInfo", {
            "CardNumber": cardNumber,
            "ExpDate": expDate.slice(0, 2).concat('/', expDate.slice(2, 6)),
            "Cvv": cvv,
            "Amount": amount
        });
        console.log(checkButtonState());
    }

    return (
        <Container className='pay-form'>
            <form noValidate autoComplete="off" className='pay-input'>
                <TextField
                    id='card-input'
                    variant="standard"
                    placeholder='Card Number'
                    margin="dense"
                    InputProps={{ inputComponent: CardFormatCustom }}
                    value={cardNumber}
                    onChange={handleCardChange}
                    onBlur={checkButtonState}
                >
                </TextField>
                <TextField
                    id='date-input'
                    variant="standard"
                    placeholder="Expiration Date"
                    margin="dense"
                    InputProps={{ inputComponent: DateFormatCustom }}
                    value={expDate}
                    onChange={handleDateChange}
                    onBlur={checkButtonState}
                >
                </TextField>
                <TextField
                    id='cvv-input'
                    variant="standard"
                    placeholder='CVV'
                    margin="dense"
                    type="password"
                    inputProps={{ maxLength: "3" }}
                    value={cvv}
                    onChange={handleNumberChange}
                    onBlur={checkButtonState}
                >
                </TextField>
                <TextField
                    id='amount-input'
                    variant="standard"
                    placeholder='Amount'
                    margin="dense"
                    value={amount}
                    onChange={handleNumberChange}
                    onBlur={checkButtonState}
                ></TextField>
            </form>

            <Button
                disabled={buttonDisabled}
                id="pay-button"
                variant="contained"
                onClick={handlePayClick}
            >
                Оплатить
            </Button>
        </Container>
    )
}

export default PayForm;