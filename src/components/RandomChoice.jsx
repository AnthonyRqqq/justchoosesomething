import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./RandomChoices.css";

export default function RandomChoice() {
  const [choiceCount, setChoiceCount] = useState(1);
  const [choices, setChoices] = useState([" "]);
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleChoiceCountChange = ({ add = true }) => {
    setSelectedChoice(null);

    if (add) {
      const choiceArray = [...choices];
      choiceArray.push("");
      setChoices(choiceArray);
      return setChoiceCount((prev) => prev + 1);
    }

    if (choiceCount <= 1) return setChoiceCount(1);

    setChoiceCount((prev) => prev - 1);
    const choiceArray = [...choices];
    choiceArray.pop();
    setChoices(choiceArray);
  };

  const handleChoiceSelect = () => {
    const validChoices = choices.filter((choice) => choice.trim());
    if (!validChoices.length) return;
    const selectedIndex = Math.floor(Math.random() * validChoices.length);
    setSelectedChoice(validChoices[selectedIndex]);
  };

  return (
    <div className="random-choices">
      <div className="random-choices-choices-list">
        Choices:{" "}
        {choices.map(
          (choice, index) => choice && <div key={index}>{choice}</div>
        )}
      </div>

      <div className="random-choices-buttons">
        <Button
          icon="pi pi-plus"
          onClick={() => handleChoiceCountChange({ add: true })}
        />
        <Button
          icon="pi pi-minus"
          onClick={() => handleChoiceCountChange({ add: false })}
        />
      </div>

      <div className="random-choices-choices-inputs">
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
      </div>

      <div className="random-choices-result">
        <Button label="Roll" onClick={() => handleChoiceSelect()} />
        {selectedChoice && <>Winner: {selectedChoice}</>}
      </div>
    </div>
  );
}
