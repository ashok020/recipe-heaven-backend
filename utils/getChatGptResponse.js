import axios from "axios";
import { config } from "../config/config.js";
export async function getChatGptResponse(keywords) {
  if (!keywords) throw new Error("No keywords provided for Chat gpt Search");
  console.log("getting result from Chat gpt for query: ", keywords);
  const response = await axios.post(
    config.api.chatgpt.url,
    {
      model: "gpt-3.5-turbo",

      messages: [
        {
          role: "system",
          content: `Generate a food recipe based on the given keywords. If the keywords represent ingredients or a dish, provide a recipe in JSON format. The output should include the following fields:
          - "found": Boolean, true/false indicating if a recipe was found or not.
          - "content": JSON Object, If "found" is true, this field should contain an object with the following fields:
              - "title": (string , example : 'test') : The name of the recipe.
              - "description": (string , example : 'test') : A short description of the recipe.
              - "ingredients": (array, Array of string only, example - ['item1','item2']) :  An array of ingredients required for the recipe.
              - "steps": (array, Array of string only , example - ['step 1','step2']) : An array of steps to prepare the recipe.
              - "time": (string , example -  't minutes / t hours')The estimated time required to cook the recipe in minutes or hours. (please include minutes or hours text also)
              - "serves": (number , example -  't') The number of people the recipe serves.
              If "found" is false, this field should contain a message string explaining why the recipe couldn't be generated.
              example -> "found": false, "content": "Sorry, I could not find any recipes with the ingredients you provided."
  
          Example 1:
          Keywords: "mango lassi"
          Output: '{
            "found": true,
            "content": {
              here content
            }
          }'
          Example 2:
          Keywords: "asdkmasdm" / "asaddjasdj,dasdk,dasdoi or "mango / mango,asdasd"
          Output: '{
            "found": false,
            "content": "Sorry, I could not find any recipes with the ingredients you provided."
          }'

          Only these three should be your answer format and return JSON string only 

          dont include steps number or ingredient number in array strings or any kind of " - " at begineing of string just give text 
            `,
        },
        { role: "user", content: `${keywords}` },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.api.chatgpt.apiKey}`,
      },
    }
  );
  const content = response.data.choices[0].message.content;
  const parsedData = JSON.parse(content);
  return parsedData;
}
