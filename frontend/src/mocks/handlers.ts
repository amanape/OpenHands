import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/options/models", () => HttpResponse.json([])),
  http.get("/api/options/agents", () => HttpResponse.json([])),
  http.get("https://api.github.com/user/repos", ({ request }) => {
    const token = request.headers
      .get("Authorization")
      ?.replace("Bearer", "")
      .trim();

    if (token !== "ghp_123456") {
      return HttpResponse.json([], { status: 401 });
    }

    return HttpResponse.json([
      { id: 1, full_name: "octocat/hello-world" },
      { id: 2, full_name: "octocat/earth" },
    ]);
  }),
  http.get("http://localhost:3000/api/list-files", () =>
    HttpResponse.json(["file1.ts", "dir1/file2.ts", "file3.ts"]),
  ),
  http.get("http://localhost:3000/api/select-file", ({ request }) => {
    const url = new URL(request.url);
    const file = url.searchParams.get("file")?.toString();

    if (file) {
      return HttpResponse.json({ code: `Content of ${file}` });
    }

    return HttpResponse.json(null, { status: 404 });
  }),
  http.get("http://localhost:3000/api/options/agents", () =>
    HttpResponse.json(["agent1", "agent2"]),
  ),
  http.get("http://localhost:3000/api/options/models", () =>
    HttpResponse.json(["some/model", "another/model"]),
  ),
];
