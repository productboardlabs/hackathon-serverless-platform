import React from "react";

import JSONPretty from "react-json-pretty";

class SubmitForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      jsonData: ""
      // jsonData: `{"test": "json"}`
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  sendRequest(email) {
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}/?email=${email}`)
      .then(response => response.json())
      .then(data => this.setState({ jsonData: data }))
      .catch(console.error);
  }

  handleChange(event) {
    this.setState({ email: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.sendRequest(this.state.email);
  }

  render() {
    const { email, jsonData } = this.state;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          flexWrap: "nowrap",
          padding: "1.5rem"
        }}
      >
        <p>Please, enter your email and we will set up everything for you.</p>
        <form onSubmit={this.handleSubmit}>
          <input
            style={{ width: "250px" }}
            value={email}
            onChange={this.handleChange}
          />
          <input
            type="submit"
            disabled={jsonData}
            value={jsonData ? "Submitted" : "Submit"}
          />
        </form>

        {jsonData && <JSONPretty id="json-pretty" data={jsonData} />}
      </div>
    );
  }
}

export default SubmitForm;
