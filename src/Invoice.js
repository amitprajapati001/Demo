import "./App.css";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {  Table } from 'react-bootstrap';
import * as Yup from "yup";

function App() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "app-id": "661398e3340527b5605f5572",
      },
    };
    fetch("https://dummyapi.io/data/v1/user", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const validationSchema = Yup.object().shape({
    fullname: Yup.string()
      .trim()
      .matches(/^[A-Za-z ]+$/, "Can only be alphabet")
      .min(3, "Must be at least 3 chars!")
      .required("Please enter Full Name"),
    date: Yup.string().required("Please enter Date"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Please enter Email"),
    phone: Yup.string()
      .matches(/^\d+$/, "Phone number is not valid")
      .required("Please enter Phone number"),
    invoicenum: Yup.number().required("Please enter Invoice number"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Item name required"),
          qty: Yup.number()
            .min(1, "Quantity must be at least 1")
            .required("Quantity required"),
          price: Yup.number()
            .min(0, "Price must be non-negative")
            .required("Price required"),
          disc: Yup.number().min(0, "Discount must be non-negative"),
          total: Yup.number().min(0, "Total must be non-negative"),
        })
      )
      .required("Must have items")
      .min(1, "Minimum of 1 item"),
  });

  const existingDataLength = localStorage.getItem("data")
  ? JSON.parse(localStorage.getItem("data")).length
  : 0;

const nextInvoiceNumber = String(existingDataLength + 1).padStart(3, "0");

  const initialValues = {
    fullname: "",
    date: "",
    email: "",
    phone: "",
    grandTotal: 0,
    invoicenum: nextInvoiceNumber,
    items: [{ name: "", qty: "", price: "", disc: "", total: 0 }],
  };

  const onSubmit = (values) => {
    const myJSON = JSON.stringify(values);
    let storedData = localStorage.getItem("data");
    storedData = storedData ? JSON.parse(storedData) : [];
    storedData.push(JSON.parse(myJSON));
    localStorage.setItem("data", JSON.stringify(storedData));
    enqueueSnackbar("Invoice Created Successfully", { variant: 'success' });
    navigate("/invoice");
  };

  const handleQtyChange = (e, index) => {
    alert("jfh");
    const newQty = parseInt(e.target.value);
    const item = formik.values.items[index];
    const newTotal = newQty * item.price - item.disc;
    formik.setFieldValue(`items.${index}.total`, newTotal);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  function delItem(){
    enqueueSnackbar("Item Deleted", { variant: 'success' });
  }

  // function addItem(){
  //   enqueueSnackbar("Invoice Created Successfully", { variant: 'success' });
  // }



  useEffect(() => {
    const subtotal = formik.values.items.reduce(
      (acc, item) => acc + item.price * item.qty - item.disc,
      0
    );
    const gst = subtotal * 0.09;
    const grandTotal = parseFloat(subtotal) + parseFloat(gst) * 2;

    formik.setFieldValue("grandTotal", grandTotal.toFixed(2));
  }, [formik.values.items]);

  return (
    <div className="maindiv">
      <div className="viewinvoice" >
      
      <Button onClick={()=>navigate("/invoice")}>View Inoice</Button>
      </div>
      <form onSubmit={formik.handleSubmit}>
      <div className="row mb-4">
        <h2 className="col-12 text-center">Customer Details</h2>
      </div>
      <div className="row g-3">
        <div className="col-md-4">
          <Form.Group controlId="fullname">
            <Form.Label>Select User</Form.Label>
            <Form.Select
              aria-label="Default select example"
              className="form-control"
              name="fullname"
              value={formik.values.fullname}
              onChange={formik.handleChange}
            >
              <option value="">Select User</option>
              {data.map((item, index) => (
                <option key={index} value={`${item.firstName} ${item.lastName}`}>
                  {`${item.firstName} ${item.lastName}`}
                </option>
              ))}
            </Form.Select>
            {formik.errors.fullname && formik.touched.fullname && (
              <div className="text-danger">{formik.errors.fullname}</div>
            )}
          </Form.Group>
        </div>

        <div className="col-md-4">
          <Form.Group controlId="date">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
            />
            {formik.errors.date && formik.touched.date && (
              <div className="text-danger">{formik.errors.date}</div>
            )}
          </Form.Group>
        </div>

        <div className="col-md-4">
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.errors.email && formik.touched.email && (
              <div className="text-danger">{formik.errors.email}</div>
            )}
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
            {formik.errors.phone && formik.touched.phone && (
              <div className="text-danger">{formik.errors.phone}</div>
            )}
          </Form.Group>
        </div>

        <div className="col-md-6">
          <Form.Group controlId="invoicenum">
            <Form.Label>Invoice Number</Form.Label>
            <Form.Control
              type="text"
              name="invoicenum"
              value={formik.values.invoicenum}
              onChange={formik.handleChange}
              readOnly
            />
            {formik.errors.invoicenum && formik.touched.invoicenum && (
              <div className="text-danger">{formik.errors.invoicenum}</div>
            )}
          </Form.Group>
        </div>
      </div>

        <div className="row additemdiv">
          <div className="card">
            <h3 className="text-center mb-3 mt-2">Add Item</h3>

            <FormikProvider value={formik}>
              <FieldArray name="items">
                {({ remove, push }) => (
                  <>
                  <Table striped bordered hover>
      <thead>
        <tr>
          <th>Enter Item</th>
          <th>Quantity</th>
          <th>Rate</th>
          <th>Discount</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {formik.values.items.map((item, index) => (
          <tr key={index}>
            <td className="col-md-2">
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name={`items.${index}.name`}
                  value={item.name}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.errors.items &&
                    formik.errors.items[index] &&
                    formik.errors.items[index].name &&
                    formik.touched.items &&
                    formik.touched.items[index] &&
                    formik.touched.items[index].name
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.items &&
                    formik.errors.items[index] &&
                    formik.errors.items[index].name}
                </Form.Control.Feedback>
              </Form.Group>
            </td>
            <td className="col-md-2">
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  name={`items.${index}.qty`}
                  value={item.qty}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.errors.items &&
                    formik.errors.items[index] &&
                    formik.errors.items[index].qty &&
                    formik.touched.items &&
                    formik.touched.items[index] &&
                    formik.touched.items[index].qty
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.items &&
                    formik.errors.items[index] &&
                    formik.errors.items[index].qty}
                </Form.Control.Feedback>
              </Form.Group>
            </td>
            <td className="col-md-2">
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  name={`items.${index}.price`}
                  value={item.price}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.errors.items &&
                    formik.errors.items[index] &&
                    formik.errors.items[index].price &&
                    formik.touched.items &&
                    formik.touched.items[index] &&
                    formik.touched.items[index].price
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.items &&
                    formik.errors.items[index] &&
                    formik.errors.items[index].price}
                </Form.Control.Feedback>
              </Form.Group>
            </td>
            <td className="col-md-2">
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  name={`items.${index}.disc`}
                  value={item.disc}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.errors.items &&
                    formik.errors.items[index] &&
                    formik.errors.items[index].disc &&
                    formik.touched.items &&
                    formik.touched.items[index] &&
                    formik.touched.items[index].disc
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.items &&
                    formik.errors.items[index] &&
                    formik.errors.items[index].disc}
                </Form.Control.Feedback>
              </Form.Group>
            </td>
            <td className="col-md-2">
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  name={`items.${index}.total`}
                  value={item.qty * item.price - item.disc}
                  readOnly
                />
              </Form.Group>
            </td>
            <td className="col-md-2">
              <Button
                variant="danger"
                className="deletebtn"
                onClick={() => {
                  remove(index);
                  delItem();
                }}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    <div className="btndiv">
    <Button
                      variant="primary"
                      className="btnadd"
                      onClick={() =>
                        push({ name: "", qty: "", price: "", disc: "", total: "" })
                      }
                    >
                      Add Item
                    </Button>
    </div>
                  
                  </>
                )}
              </FieldArray>
            </FormikProvider>

            <div className="col-md-4 billingdetailsdiv">
              <h4>Billing Details</h4>
              <table className="table table-bordered charge-table">
                <thead className="table table-bordered charge-table">
                  <tr>
                    <th className="thead-light">Charge Type</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Item Charge</td>
                    <td className="text-end">
                      {formik.values.items
                        .reduce((acc, item) => acc + item.price * item.qty, 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>Labour Charge</td>
                    <td className="text-end">0.00</td>
                  </tr>

                  <tr>
                    <td>Total Item</td>
                    <td className="text-end">{formik.values.items.length}</td>
                  </tr>
                  <tr>
                    <td>Subtotal</td>
                    <td className="text-end">
                      {formik.values.items
                        .reduce(
                          (acc, item) =>
                            acc + item.price * item.qty - item.disc,
                          0
                        )
                        .toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>CGST (9%)</td>
                    <td className="text-end">
                      {(
                        formik.values.items.reduce(
                          (acc, item) =>
                            acc + item.price * item.qty - item.disc,
                          0
                        ) * 0.09
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>SGST (9%)</td>
                    <td className="text-end">
                      {(
                        formik.values.items.reduce(
                          (acc, item) =>
                            acc + item.price * item.qty - item.disc,
                          0
                        ) * 0.09
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Discount</td>
                    <td className="text-end">
                      {(
                        formik.values.items.reduce(
                          (acc, item) =>
                            acc + item.disc,
                          0
                        ) * 1
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr className="grand-total">
                    <td>Grand Total</td>
                    <td className="text-end">
                      {(
                        parseFloat(
                          formik.values.items.reduce(
                            (acc, item) =>
                              acc + item.price * item.qty - item.disc,
                            0
                          )
                        ) +
                        parseFloat(
                          formik.values.items.reduce(
                            (acc, item) =>
                              acc + item.price * item.qty - item.disc,
                            0
                          ) *
                            0.09 *
                            2
                        )
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="btndiv btndivsubmit"><Button className="" variant="primary" type="submit" >
          Submit
        </Button></div>

        
      </form>
    </div>
  );
}

export default App;
