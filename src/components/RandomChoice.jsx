import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function RandomChoice() {
  const [choiceCount, setChoiceCount] = useState(1);
  const [choices, setChoices] = useState([" "]);
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleChoiceCountChange = ({ add = true }) => {
    setSelectedChoice(null);

    if (add) return setChoiceCount((prev) => prev + 1);

    if (choiceCount <= 1) return setChoiceCount(1);

    setChoiceCount((prev) => prev - 1);
    const choiceArray = [...choices];
    choiceArray.pop();
    setChoices(choiceArray);
  };

  const handleChoiceSelect = () => {
    const selectedIndex = Math.floor(Math.random() * choiceCount);
    setSelectedChoice(choices[selectedIndex]);
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
              setSelectedChoice(null);

              const newChoice = e.target.value;
              const choiceArray = [...choices];
              choiceArray[index] = newChoice;
              setChoices(choiceArray);
            }}
          />
        );
      })}

      <Button label="Roll" onClick={() => handleChoiceSelect()} />
      {selectedChoice && <>Winner: {selectedChoice}</>}
    </>
  );
}
