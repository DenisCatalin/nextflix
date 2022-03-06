async function queryHasuraGQL(operationsDoc, operationName, variables) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_HASURA_ADMIN_URL}`, {
    method: "POST",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRlbmlzIiwiaWF0IjoxNjQ2NTkxOTExLCJleHAiOjE2NDcxOTY3NDAsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiJEZW5pcyJ9fQ.a3bsg3WptE_zpAffx1kfTo8Ht2I9DSigUvrzA9utsX8",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

const operationsDoc = `
    query MyQuery {
      users {
        id
        email
      }
    }
`;

function fetchMyQuery() {
  return queryHasuraGQL(operationsDoc, "MyQuery", {});
}

export async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();

  if (errors) {
    console.error(errors);
  }

  console.log(data);
}

startFetchMyQuery();

async function startExecuteMyMutation() {
  const { errors, data } = await executeMyMutation();

  if (errors) {
    console.error(errors);
  }
  console.log(data);
}

startExecuteMyMutation();
