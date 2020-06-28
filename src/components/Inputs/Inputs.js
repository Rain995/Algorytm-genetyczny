import React from "react";
import Input from "./Input/Input";

const Inputs = ({
  handleinput,
  populationSize,
  result,
  iterations,
  cross,
  mutations
}) => {
  const inputsToCreate = [
    {
      prependText: "Wielkość populacji",
      type: "number",
      value: populationSize,
      id: "populationSize"
    },
    {
      prependText: "Oczekwiany wynik",
      type: "number",
      value: result,
      id: "result"
    },
    {
      prependText: "Ilość pokoleń",
      type: "number",
      value: iterations,
      id: "iterations"
    },
    {
      prependText: "Krzyżowanie",
      type: "number",
      value: cross,
      id: "cross"
    },
    {
      prependText: "Mutacja",
      type: "number",
      value: mutations,
      id: "mutations"
    }
  ];

  const inputsToRender = inputsToCreate.map(
    ({ prependText, type, value, id }) => (
      <Input
        key={id}
        onChange={e => handleinput({ type: id, value: e.target.value })}
        prependText={prependText}
        type={type}
        value={value}
        id={id}
      />
    )
  );

  return <div> {inputsToRender} </div>;
};

export default Inputs;
