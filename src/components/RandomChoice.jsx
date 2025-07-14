import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import "./RandomChoices.css";

export default function RandomChoice() {
  const [choices, setChoices] = useState([" "]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    console.log(progress);
  }, [progress]);

  const handleChoiceSelect = () => {
    const validChoices = choices.filter((choice) => choice.trim());
    if (!validChoices.length) {
      return setSelectedChoice("[No choices...Awkward]");
    }

    const selectedIndex = Math.floor(Math.random() * validChoices.length);

    if (validChoices.length > 1) {
      let count = 0;
      const maxCycles = 20;
      let previousIndex;

      setRolling(true);
      const interval = setInterval(() => {
        let randomIndex = Math.floor(Math.random() * validChoices.length);
        if (previousIndex === randomIndex) {
          if (randomIndex === validChoices.length) randomIndex -= 1;
          else randomIndex += 1;
        }

        previousIndex = randomIndex;
        // console.log(randomIndex);
        setSelectedChoice(validChoices[randomIndex]);

        count++;
        setProgress((count / maxCycles) * 100);
        if (count >= maxCycles) {
          setRolling(false);
          setProgress(0);
          setSelectedChoice(validChoices[selectedIndex]);
          clearInterval(interval);
        }
      }, 100);
    } else setSelectedChoice(validChoices[selectedIndex]);
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
        <div>
          <Button label="Roll" onClick={() => handleChoiceSelect()} />
        </div>
        {rolling && (
          <div className="random-choices-calculating">
            <ProgressBar mode="indeterminate" value={progress}></ProgressBar>
            <div>Calculating...</div>
            <div>{selectedChoice}</div>
          </div>
        )}
        {selectedChoice && !rolling && <div>Winner: {selectedChoice}</div>}
      </div>
    </div>
  );
}
