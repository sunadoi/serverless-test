import { GraphQLClient, gql } from "graphql-request";
import { getTask } from "./query";
import { createTask, deleteTask } from "./mutation";

const client = new GraphQLClient("http://localhost:20002/graphql", {
  headers: {
    // format さえ合っていればなんでもok
    Authorization:
      "euJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZDhjYTUyOC00OTMxLTQyNTQtOTI3My1lYTVlZTg1M2YyNzEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbS91cy1lYXN0LTFfZmFrZSIsInBob25lX251bWJlcl92ZXJpZmllZCI6dHJ1ZSwiY29nbml0bzp1c2VybmFtZSI6InVzZXIxIiwiYXVkIjoiMmhpZmEwOTZiM2EyNG12bTNwaHNrdWFxaTMiLCJldmVudF9pZCI6ImIxMmEzZTJmLTdhMzYtNDkzYy04NWIzLTIwZDgxOGJkNzhhMSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxOTc0MjY0NDEyLCJwaG9uZV9udW1iZXIiOiIrMTIwNjIwNjIwMTYiLCJleHAiOjE1OTY5NDE2MjkwLCJpYXQiOjE1NjQyNjQ0MTMsImVtYWlsIjoidXNlckBkb21haW4uY29tIn0.mKvvVDRN07IvChh1uHloKz5NdUe2bRu6fyPOpzVbE_M",
  },
});

describe("dynamodb resolver", () => {
  test("createTask / getTask by id and status / deleteTask", async () => {
    const variables = {
      id: "123456789",
      name: "新しいタスク",
      status: "NoStatus",
    };

    // 新規にデータを作成する
    const created = await client.request(createTask, variables);
    expect(created).toStrictEqual({ createTask: variables });

    // 作成したデータが取得できる
    const got = await client.request(getTask, {
      id: variables.id,
      status: variables.status,
    });
    expect(got.getTask).toEqual(variables);

    // データが削除できる
    const deleted = await client.request(deleteTask, {
      id: variables.id,
      status: variables.status,
    });
    expect(deleted).toStrictEqual({ deleteTask: variables });
  });
});
