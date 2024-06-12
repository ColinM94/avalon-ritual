import { useNavigate } from "react-router-dom";

import { Button, Header } from "components";
import { Characters } from "types";
import { generateLobbyCode, reactReducer } from "utils";
import { charactersDefault, maxCharacters } from "consts";
import { useAppStore, useToastStore } from "stores";

import { SetupCharacters } from "./components/setupCharacters/setupCharacters";
import { SetupOptions } from "./components/setupOptions/setupOptions";
import styles from "./styles.module.scss";

export const SetupPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToastStore();

  const { player, session, updatePlayer, updateSession } = useAppStore();

  if (!session.createdBy) {
    updateSession({
      id: generateLobbyCode(),
      createdBy: player.id,
      name: "",
      numPlayers: 5,
      players: [player.id],
    });

    updatePlayer({
      sessionId: session.id,
    });
  }

  const [characters, updateCharacters] =
    reactReducer<Characters>(charactersDefault);

  const numActiveGoodCharacters = Object.values(characters).filter(
    (character) => character.allegiance === "good" && character.isActive
  ).length;

  const numActiveEvilCharacters = Object.values(characters).filter(
    (character) => character.allegiance === "evil" && character.isActive
  ).length;

  const maxGoodCharacters = maxCharacters[session.numPlayers]?.good;
  const maxEvilCharacters = maxCharacters[session.numPlayers]?.evil;

  const handleContinue = async () => {
    if (!player.id) return;

    try {
      // if (!session.name) {
      //   throw "Please enter a name";
      // }

      if (numActiveGoodCharacters !== maxGoodCharacters) {
        const numRemaining = maxGoodCharacters - numActiveGoodCharacters;

        if (Math.sign(numRemaining) === 1) {
          throw `Please select ${numRemaining} more Good character${
            numRemaining === 1 ? "" : "s"
          }!`;
        } else {
          throw `You have selected too many Good character${
            numRemaining === 1 ? "" : "s"
          }!`;
        }
      }

      if (numActiveEvilCharacters !== maxEvilCharacters) {
        const numRemaining = maxEvilCharacters - numActiveEvilCharacters;

        if (Math.sign(numRemaining) === 1) {
          throw `Please select ${numRemaining} more Evil character${
            numRemaining === 1 ? "" : "s"
          }!`;
        } else {
          throw `You have selected too many Evil character${
            numRemaining === 1 ? "" : "s"
          }!`;
        }
      }

      updatePlayer({
        ...player,
        sessionId: session.id,
      });

      navigate(`/lobby/${session.id}`);
    } catch (error) {
      showToast(String(error));
    }
  };

  return (
    <>
      <Header heading="Avalon Setup" />

      <div className={styles.container}>
        <SetupOptions
          session={session}
          updateSession={updateSession}
          headingClassName={styles.heading}
        />

        <SetupCharacters
          heading="Good Characters"
          allegiance="good"
          characters={characters}
          maxActiveCharacters={maxGoodCharacters}
          updateCharacters={updateCharacters}
          numActiveCharacters={numActiveGoodCharacters}
          headingClassName={styles.heading}
        />

        <SetupCharacters
          heading="Evil Characters"
          allegiance="evil"
          characters={characters}
          maxActiveCharacters={maxEvilCharacters}
          updateCharacters={updateCharacters}
          numActiveCharacters={numActiveEvilCharacters}
          headingClassName={styles.heading}
        />

        <Button
          label="Continue"
          onClick={handleContinue}
          className={styles.continueButton}
        />
      </div>
    </>
  );
};
