import { expect, test } from "@jest/globals";
import request from "supertest";
import app from "../templates/scripts/app";

// Simply using data I know is already in the current api
// and is no longer relevant if the api is changed or updated.
const testData = [
  { id: 1, title: "Isle of dogs" },
  { id: 2, title: "Encanto" },
  { id: 3, title: "The Shawshank Redemption" },
  { id: 4, title: "Min granne Totoro" },
  { id: 5, title: "The Muppets" },
  { id: 6, title: "Forrest Gump" },
  { id: 8, title: "Pulp Fiction" },
];

// Loops hardcoded data in a loop to test page load and title names
for (const data of testData) {
  test(`${data.title} page loads properly and shows title of movie`, async () => {
    const response = await request(app)
      .get(`/filmer/${data.id}`)
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect(200);
    expect(response.text).toContain(data.title);
  });
}