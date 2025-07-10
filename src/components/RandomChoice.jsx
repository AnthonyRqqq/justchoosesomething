import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./RandomChoices.css";

export default function RandomChoice() {
  const [choices, setChoices] = useState([" "]);
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleChoiceCountChange = ({ add = true, index }) => {
    setSelectedChoice(null);

    if (add) {
      const choiceArray = [...choices];
      choiceArray.push("");
      return setChoices(choiceArray);
    }

    if (choices.length <= 1) return;

    let choiceArray = [...choices];
    if (index) choiceArray.splice(index, 1);
    else choiceArray.pop();

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
        {choices.map((choice, index) => {
          return (
            <div>
              <i
                className="pi pi-trash"
                onClick={() => handleChoiceCountChange({ add: false, index })}
              />
              <InputText
                key={index}
                onChange={(e) => {
                  setSelectedChoice(null);

                  const newChoice = e.target.value;
                  const choiceArray = [...choices];
                  choiceArray[index] = newChoice;
                  setChoices(choiceArray);
                }}
                value={choice}
              />
            </div>
          );
        })}
      </div>

      <div className="random-choices-result">
        <Button label="Roll" onClick={() => handleChoiceSelect()} />
        {selectedChoice && <div>Winner: {selectedChoice}</div>}
      </div>
    </div>
  );
}
