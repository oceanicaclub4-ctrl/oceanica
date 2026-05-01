exports.handler = async function (event) {
  const password = event.headers["x-admin-password"];

  if (password !== process.env.ADMIN_PASSWORD) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }

  const { file, content, sha } = JSON.parse(event.body);

  const url = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/data/${file}.json`;

  const encodedContent = Buffer.from(
    JSON.stringify(content, null, 2)
  ).toString("base64");

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    },
    body: JSON.stringify({
      message: `Update ${file}.json`,
      content: encodedContent,
      sha,
      branch: process.env.GITHUB_BRANCH
    })
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
