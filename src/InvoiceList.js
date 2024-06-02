import "./App.css";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
function InvoiceList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("data");

    if (storedData) {
      setData(JSON.parse(storedData));
    }

    setLoading(false);
  }, []);

  return (
    <div className="maindiv">
      <div className="invbtn">
        <Button variant="primary" onClick={() => navigate("/")}>
          Create Invoices
        </Button>
      </div>

      <div>
      <h3 className="text-center">Invoice List</h3>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card cardmaindiv">
        
        <table className="table table-striped mb-0">
        <thead className="thead-dark">
          <tr>
            <th>Invoice Number</th>
            <th>Customer Name</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3">No invoices found.</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.invoicenum}</td>
                <td>{item.fullname}</td>
                <td>{item.grandTotal}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
      )}
    </div>
  );
}

export default InvoiceList;
