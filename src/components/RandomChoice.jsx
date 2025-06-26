import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function RandomChoice() {
  const [choiceCount, setChoiceCount] = useState(1);
  const [choices, setChoices] = useState([" "]);

  const handleChoiceCountChange = ({ add = true }) => {
    if (add) return setChoiceCount((prev) => prev + 1);

    if (choiceCount <= 1) return setChoiceCount(1);

    setChoiceCount((prev) => prev - 1);
    const choiceArray = [...choices];
    choiceArray.pop();
    setChoices(choiceArray);
  };

  return (
    <>
      <div>
        Choices:{" "}
        {choices.map((choice, index) => (
          <div key={index}>{choice}</div>
        ))}
      </div>

      <Button
        icon="pi pi-plus"
        onClick={() => handleChoiceCountChange({ add: true })}
      />
      <Button
        icon="pi pi-minus"
        onClick={() => handleChoiceCountChange({ add: false })}
      />

      {Array.from({ length: choiceCount }).map((_, index) => {
        return (
          <InputText
            key={index}
            onChange={(e) => {
              const newChoice = e.target.value;
              const choiceArray = [...choices];
              choiceArray[index] = newChoice;
              setChoices(choiceArray);
            }}
          />
        );
      })}
    </>
  );
}
