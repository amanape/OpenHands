import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { useFetcher } from "@remix-run/react";
import { RootState } from "#/store";
import FolderIcon from "../FolderIcon";
import FileIcon from "../FileIcons";
import { listFiles } from "#/services/fileService";
import { setCode, setActiveFilepath } from "#/state/codeSlice";
import { retrieveFileContent } from "#/api/open-hands";
import { useFiles } from "#/context/files";

interface TitleProps {
  name: string;
  type: "folder" | "file";
  isOpen: boolean;
  onClick: () => void;
}

function Title({ name, type, isOpen, onClick }: TitleProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-[5px] p-1 nowrap flex items-center gap-2 aria-selected:bg-neutral-600 aria-selected:text-white hover:text-white"
    >
      <div className="flex-shrink-0">
        {type === "folder" && <FolderIcon isOpen={isOpen} />}
        {type === "file" && <FileIcon filename={name} />}
      </div>
      <div className="flex-grow">{name}</div>
    </div>
  );
}

interface TreeNodeProps {
  path: string;
  defaultOpen?: boolean;
}

function TreeNode({ path, defaultOpen = false }: TreeNodeProps) {
  const { setFileContent, modifiedFiles, setSelectedPath, files } = useFiles();
  const fetcher = useFetcher({ key: "file-selector" });

  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [children, setChildren] = React.useState<string[] | null>(null);
  const refreshID = useSelector((state: RootState) => state.code.refreshID);
  const activeFilepath = useSelector((state: RootState) => state.code.path);

  const dispatch = useDispatch();

  const fileParts = path.split("/");
  const filename =
    fileParts[fileParts.length - 1] || fileParts[fileParts.length - 2];

  const isDirectory = path.endsWith("/");

  const refreshChildren = async () => {
    if (!isDirectory || !isOpen) {
      setChildren(null);
      return;
    }
    const files = await listFiles(path);
    setChildren(files);
  };

  React.useEffect(() => {
    (async () => {
      await refreshChildren();
    })();
  }, [refreshID, isOpen]);

  const handleClick = async () => {
    if (isDirectory) {
      setIsOpen((prev) => !prev);
    } else {
      // TODO: Move to data loader
      const token = localStorage.getItem("token");
      if (token) {
        let code = modifiedFiles[path] || files[path];
        if (!code) {
          code = await retrieveFileContent(token, path);
          setFileContent(path, code);
        }

        setSelectedPath(path);
        dispatch(setCode(code));
        dispatch(setActiveFilepath(path));
      } else {
        // TODO: Show error message
        console.error("No token found");
      }
    }
  };

  return (
    <div
      data-testid="tree-node"
      className={twMerge(
        "text-sm text-neutral-400",
        path === activeFilepath ? "bg-gray-700" : "",
      )}
    >
      <fetcher.Form method="post" action="?index">
        <button
          type={isDirectory ? "button" : "submit"}
          name="file"
          value={path}
          className="flex items-center justify-between w-full px-1"
        >
          <Title
            name={filename}
            type={isDirectory ? "folder" : "file"}
            isOpen={isOpen}
            onClick={handleClick}
          />

          {modifiedFiles[path] && (
            <div className="w-2 h-2 rounded-full bg-neutral-500" />
          )}
        </button>
      </fetcher.Form>

      {isOpen && children && (
        <div className="ml-5">
          {children.map((child, index) => (
            <TreeNode key={index} path={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(TreeNode);
