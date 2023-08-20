import {httpGet, httpPost} from "../utils/api-utils";
import useEndpoint from "../hooks/use-endpoint";
import Word from "../types/word";

function getAllWordsEndpoint() {
  function requestFunc() {
    return httpGet("api/words/get-all");
  }

  return useEndpoint<Word[]>(requestFunc, []);
}

function getWordEndpoint() {
  type Params = {
    wordId: number
  }

  function requestFunc(params: Params) {
    return httpGet("api/words/get-word", params);
  }

  return useEndpoint<Word | null, Params>(requestFunc, null);
}

function createWordEndpoint() {
  type Params = {
    russian: string,
    english: string,
  }

  function requestFunc(params: Params) {
    return httpPost("api/words/create", params);
  }

  return useEndpoint<Word | null, Params>(requestFunc, null);
}

function deleteWordEndpoint() {
  type Params = {
    wordId: number,
  }

  function requestFunc(params: Params) {
    return httpPost("api/words/delete", params);
  }

  return useEndpoint<null, Params>(requestFunc, null);
}

export default {
  getAllWordsEndpoint,
  getWordEndpoint,
  createWordEndpoint,
  deleteWordEndpoint,
};