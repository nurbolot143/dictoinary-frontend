import React, {FormEvent, useEffect} from "react";
import wordsApi from "./api/words-api";

export default function App() {

  const getAllWordsEndpoint = wordsApi.getAllWordsEndpoint();
  const createWordEndpoint = wordsApi.createWordEndpoint();
  const deleteWordEndpoint = wordsApi.deleteWordEndpoint();

  useEffect(() => {
    fetchWords();
  }, []);

  async function fetchWords() {
    await getAllWordsEndpoint.call();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const {russian, english} = e.target;

    const params = {
      russian: russian.value,
      english: english.value,
    };

    const {error} = await createWordEndpoint.call(params);

    if (error) {
      alert(error.message);
      return;
    }

    russian.value = null;
    english.value = null;

    alert("Success");
    await fetchWords();
  }

  async function deleteWord(wordId: number) {
    const {error} = await deleteWordEndpoint.call({wordId: wordId});

    if (error) {
      alert(error.message);
      return;
    }

    alert("Success");
    await fetchWords();
  }

  return (
    <div style={{textAlign: "center"}}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="text">Russian</label>
        <input type="text" name="russian"/>

        <label htmlFor="english">English</label>
        <input type="text" name="english"/>

        <button type="submit">Ok</button>
      </form>

      <button onClick={fetchWords}>Refresh</button>

      {getAllWordsEndpoint.result.map((word) => (
        <div key={word.id}>
          <div style={{display: "flex", gap: 40}}>
            <div>{word.russian}</div>
            <div>{word.english}</div>
          </div>

          <button onClick={() => deleteWord(word.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
}