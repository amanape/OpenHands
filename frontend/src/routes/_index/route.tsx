import {
  ClientActionFunctionArgs,
  json,
  redirect,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import React from "react";
import { SuggestionBox } from "./suggestion-box";
import { TaskForm } from "./task-form";
import { HeroHeading } from "./hero-heading";
import { GitHubRepositorySelector } from "./github-repo-selector";
import {
  isGitHubErrorReponse,
  retrieveAllGitHubUserRepositories,
} from "#/api/github";
import ModalButton from "#/components/buttons/ModalButton";
import GitHubLogo from "#/assets/branding/github-logo.svg?react";
import { ConnectToGitHubModal } from "#/components/modals/connect-to-github-modal";
import { ModalBackdrop } from "#/components/modals/modal-backdrop";
import { LoadingSpinner } from "#/components/modals/LoadingProject";

export const clientLoader = async () => {
  const ghToken = localStorage.getItem("ghToken");
  const token = localStorage.getItem("token");

  if (token) {
    return redirect("/app");
  }

  let repositories: GitHubRepository[] = [];
  if (ghToken) {
    const data = await retrieveAllGitHubUserRepositories(ghToken);
    if (!isGitHubErrorReponse(data)) {
      repositories = data;
    }
  }

  return json({ repositories, ghToken });
};

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const searchParams = new URLSearchParams();

  const url = new URL(request.url);
  const repo = url.searchParams.get("repo");

  const formData = await request.formData();

  const q = formData.get("q")?.toString();
  const reset = formData.get("reset")?.toString() === "true";

  if (q) searchParams.set("q", q);
  if (repo) searchParams.set("repo", repo);
  if (reset) {
    searchParams.set("reset", "true");
    localStorage.removeItem("token");
  }

  return redirect(`/app?${searchParams.toString()}`);
};

function Home() {
  const navigation = useNavigation();
  const { repositories, ghToken } = useLoaderData<typeof clientLoader>();
  const [connectToGitHubModalOpen, setConnectToGitHubModalOpen] =
    React.useState(false);

  return (
    <div className="bg-root-secondary h-full rounded-xl flex flex-col items-center justify-center gap-16 relative">
      {navigation.state === "loading" && (
        <div className="absolute top-8 right-8">
          <LoadingSpinner size="small" />
        </div>
      )}
      <HeroHeading />
      <TaskForm />
      <div className="flex gap-4">
        <SuggestionBox
          title="Open a Repo"
          content={
            ghToken ? (
              <GitHubRepositorySelector repositories={repositories} />
            ) : (
              <ModalButton
                text="Connect to GitHub"
                icon={<GitHubLogo width={20} height={20} />}
                className="bg-[#791B80] w-full"
                onClick={() => setConnectToGitHubModalOpen(true)}
              />
            )
          }
        />
        <SuggestionBox title="+ Import Project" content="from your desktop" />
      </div>
      {connectToGitHubModalOpen && (
        <ModalBackdrop>
          <ConnectToGitHubModal
            onClose={() => setConnectToGitHubModalOpen(false)}
          />
        </ModalBackdrop>
      )}
    </div>
  );
}

export default Home;
