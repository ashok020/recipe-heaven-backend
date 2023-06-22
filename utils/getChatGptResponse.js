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
          - "found": true/false indicating if a recipe was found or not.
          - "content": If "found" is true, this field should contain an object with the following fields:
              - "title": The name of the recipe.
              - "description": A short description of the recipe.
              - "ingredients": An array of ingredients required for the recipe.
              - "steps": An array of steps to prepare the recipe.
              - "time": The estimated time required to cook the recipe in minutes or hours.
            If "found" is false, this field should contain a message string explaining why the recipe couldn't be generated.
          
          Example 1:
          Keywords: "mango lassi"
          Output: '{
            "found": true,
            "content": {
              "title": "Mango Lassi",
              "description": "Mango lassi is a popular Indian drink made with ripe mangoes, yogurt, and sugar. It is known for its creamy texture, sweet-tangy flavor, and refreshing taste. Enjoyed chilled, it is a delightful summer beverage.",
              "ingredients": [
                fill ingredients here
              ],
              "steps": [
               fill steps here
              ],
              "time": 10 minutes
            }
          }'
          
          Example 2:
          Keywords: "mango" / "sadasdasdasd,manogo
          Output: '{
            "found": false,
            "content": "Sorry, I need more information about what recipe you would like me to generate with the mango ingredient."
          }'
          
          Example 3:
          Keywords: "asdkmasdm" / "asaddjasdj,dasdk,dasdoi
          Output: '{
            "found": false,
            "content": "Sorry, I could not find any recipes with the ingredients you provided."
          }'

          Only these three should be your answer format and return JSON string only 
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
  console.log(parsedData);
  return parsedData;
}
