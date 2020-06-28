import React from "react";
import { FormControl, InputGroup } from "react-bootstrap";

const SingleInput = ({ prependText, type, value, id, onChange }) => (
  <>
    <label htmlFor={id}> </label>
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text> {prependText} </InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        type={type}
        id={id}
        value={value}
        onChange={e => onChange(e)}
      />
    </InputGroup>
  </>
);

export default SingleInput;
