import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import "./RandomChoices.css";

export default function RandomChoice() {
  const [choices, setChoices] = useState([" "]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * Modifies the list of choices by either adding a new blank entry or removing one.
   *
   * @param {Object} options - Configuration for how to modify the list.
   * @param {boolean} [options.add=true] - If true, adds a new empty string to the list of choices.
   * @param {number} [options.index] - If provided (and `add` is false), removes the choice at this index.
   *                                    Otherwise, removes the last choice.
   *
   * - If `add` is true: adds a new blank choice to the end.
   * - If `add` is false and `index` is provided: removes the choice at that index.
   * - If `add` is false and `index` is not provided: removes the last item, unless only one item remains.
   *
   * Resets any selected result by clearing `selectedChoice`.
   */
  const handleChoiceCountChange = ({ add = true, index }) => {
    setSelectedChoice(null);

    if (add) {
      const choiceArray = [...choices];
      choiceArray.push("");
      return setChoices(choiceArray);
    }

    if (choices.length <= 1) return;

    let choiceArray = [...choices];
    if (index !== undefined) choiceArray.splice(index, 1);
    else choiceArray.pop();

    setChoices(choiceArray);
  };

  /**
   * Initiates a randomized "roll" animation to select one of the valid choices.
   *
   * Behavior:
   * - Filters out empty or whitespace-only choices.
   * - If no valid choices exist, sets a placeholder message: "[No choices...Awkward]".
   * - If only one valid choice exists, it is selected immediately.
   * - If multiple valid choices exist:
   *    - Randomly cycles through them (`maxCycles` times) to simulate a rolling effect.
   *    - Uses a timed interval to update the selection every 100ms.
   *    - Ensures no two consecutive choices are the same for visual variety.
   *    - After rolling, the final choice is set to a randomly selected one.
   *    - Progress percentage is updated during the animation for UI feedback.
   *
   * Side Effects:
   * - Updates `selectedChoice` with each intermediate and final result.
   * - Updates `progress` (for a progress bar) and `rolling` (for disabling UI during roll).
   * - Uses `setInterval` and `clearInterval` for animation timing.
   */
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
          onClick={(e) => {
            e.target.blur();
            handleChoiceCountChange({ add: true });
          }}
        />
        <Button
          icon="pi pi-minus"
          onClick={(e) => {
            e.target.blur();
            handleChoiceCountChange({ add: false });
          }}
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
          <Button
            label="Roll"
            onClick={(e) => {
              e.target.blur();
              handleChoiceSelect();
            }}
          />
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
