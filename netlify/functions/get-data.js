exports.handler = async function (event) {
  const password = event.headers["x-admin-password"];

  if (password !== process.env.ADMIN_PASSWORD) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }

  const file = event.queryStringParameters.file;

  if (!["events", "menu"].includes(file)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid file" })
    };
  }

  const url = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/data/${file}.json?ref=${process.env.GITHUB_BRANCH}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    }
  });

  const data = await res.json();

  const content = Buffer.from(data.content, "base64").toString("utf8");

  return {
    statusCode: 200,
    body: JSON.stringify({
      content: JSON.parse(content),
      sha: data.sha
    })
  };
};
