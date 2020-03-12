import * as core from "@actions/core";
import * as github from "@actions/github";
import * as fs from "fs";

async function run() {
  const token = core.getInput("token");

  const octokit = new github.GitHub(token);
  const context = github.context;

  const changelog = fs.readFileSync("./.nupkg/changelog.md", {
    encoding: "UTF8"
  });

  const newIssue = await octokit.issues.create({
    ...context.repo,
    labels: [`awaiting-review`, "release-candidate"],
    title: `Release ${core.getInput("package-version")} ready for review`,
    body: `# :rocket: Release ${core.getInput(
      "package-version"
    )} ready for review

## Changelog

---

${changelog}
    `
  });

  await octokit.issues.createComment({
    ...context.repo,
    issue_number: newIssue.data.id,
    body: `Action: ${core.getInput("action-id")}`
  });

  core.setOutput("issue-id", newIssue.data.id.toString());
}

run();
