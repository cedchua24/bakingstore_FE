import { useState, useEffect } from "react";

import PaymentTermService from "../OtherService/PaymentTermService";
import CreditCardDueService from "../OtherService/CreditCardDueService";
import { Form, FloatingLabel } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LinearProgress from '@mui/material/LinearProgress';



const CreditCardDueSettings = () => {

  useEffect(() => {
    fetchCreditCardPaymentList(2);
  }, []);

  const [paymentTermList, setPaymentTermList] = useState({
    data: [],
    details: {}
  });


  const [submitLoading, setSubmitLoading] = useState(false);
  const [validator, setValidator] = useState({
    severity: '',
    message: '',
    isShow: false
  });


  const [creditCardDue, setCreditCardDue] = useState({
    payment_type_po_id: 0,
    type: 'CREDIT_CARD',
    due_date: 0,
    statement_date: 0,
  });



  const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
  const [isAddDisabled, setIsAddDisabled] = useState(false);

  const [formErrors, setFormErrors] = useState({});

  const validate = (values) => {
    const errors = {};
    console.log("creditCardDue: ", creditCardDue);
    if (creditCardDue.payment_type_po_id == 0) {
      errors.payment_type_po_id = "Choose Credit Card!";
    }

    return errors;
  }



  const saveProduct = (event) => {
    event.preventDefault();
    console.log("count: ", Object.keys(validate(creditCardDue)).length);
    console.log("validate: ", validate(creditCardDue));
    setFormErrors(validate(creditCardDue));
    if (Object.keys(validate(creditCardDue)).length > 0) {
      console.log("Has Validation: ");

    } else {
      console.log("Ready for saving: ");
      setSubmitLoadingAdd(true);
      setIsAddDisabled(true);
      CreditCardDueService.sanctum().then(response => {
        CreditCardDueService.createCreditDueYearly(creditCardDue)
          .then(response => {
            if (response.data.code == 200) {
              if (response.data.data.length == 0) {
                setSubmitLoading(false);
                window.scrollTo(0, 0);
                setValidator({
                  severity: 'warning',
                  message: 'Monthly List already Updated',
                  isShow: true,
                });
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);

              } else {
                setSubmitLoading(false);
                window.scrollTo(0, 0);
                setValidator({
                  severity: 'success',
                  message: response.data.data,
                  isShow: true,
                });
                setSubmitLoadingAdd(false);
                setIsAddDisabled(false);
              }

            } else if (response.data.code == 400) {
              setSubmitLoading(false);
              window.scrollTo(0, 0);
              setValidator({
                severity: 'error',
                message: response.data.message,
                isShow: true,
              });
              setSubmitLoadingAdd(false);
              setIsAddDisabled(false);
            } else {
              setSubmitLoading(false);
              setValidator({
                severity: 'error',
                message: "Unknown Error",
                isShow: true,
              });
              setSubmitLoadingAdd(false);
              setIsAddDisabled(false);
            }
          })
          .catch(e => {
            console.log(e);
          });
      });
    }
  }

  const fetchCreditCardPaymentList = (id) => {
    PaymentTermService.fetchCreditCardPaymentListV2(id)
      .then(response => {
        setPaymentTermList(response.data);
        console.log('log', response.data)
      })
      .catch(e => {
        console.log("error", e)
      });
  }

  const handleInputChange = (e, value) => {
    e.persist();
    setCreditCardDue({
      ...creditCardDue,
      payment_type_po_id: value.id,
      due_date: value.due_date,
      statement_date: value.statement_date
    });
  }



  const testController = () => {
    CreditCardDueService.testController()
      .then(response => {
      })
      .catch(e => {
        console.log("error", e)
      });
  }



  return (
    <div>

      <Form onSubmit={saveProduct}>
        <Stack sx={{ width: '100%' }} spacing={2}>
          {validator.isShow &&
            <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
          }
        </Stack>


        <br></br>
        <Box
          sx={{
            '& .MuiTextField-root': { m: 1, width: '65ch' },
          }}
          noValidate
          autoComplete="off"
        >
          {formErrors.payment_type_po_id && <p style={{ color: "red" }}>{formErrors.payment_type_po_id}</p>}
          <FormControl variant="standard" >
            <Autocomplete
              // {...defaultProps}
              options={paymentTermList.data}
              className="mb-3"
              id="disable-close-on-select"
              onChange={handleInputChange}
              getOptionLabel={(paymentTerm) => paymentTerm.bank_name + " " + paymentTerm.account_description +
                " - " + paymentTerm.account_number + " - " + paymentTerm.account_name}
              renderInput={(params) => (
                <TextField {...params} label="Choose Credit Card" variant="standard" />
              )}
            />
          </FormControl>
          <br></br>
        </Box>
        <br></br>

        <FloatingLabel
          controlId="floatingInput"
          label="Due Date"
          className="mb-3"

        >
          <Form.Control type="text" value={creditCardDue.due_date} name="Due Date" />
        </FloatingLabel>

        <br></br>

        <FloatingLabel
          controlId="floatingInput"
          label="Statement Date"
          className="mb-3"

        >
          <Form.Control type="text" value={creditCardDue.statement_date} name="statement Date" />
        </FloatingLabel>

        <Button
          variant="contained"
          type="submit"
          disabled={isAddDisabled}
        >
          Submit
        </Button>
        <br></br>
        <br></br>
        {submitLoadingAdd &&
          <LinearProgress color="warning" />
        }
        <br></br>
      </Form>
      <br></br>


      <br></br>
      <Button
        variant="error"

        type="submit"
        onClick={testController}
        size="large" >
        Dont Click
      </Button>
      <br></br>
    </div >
  )
}

export default CreditCardDueSettings
