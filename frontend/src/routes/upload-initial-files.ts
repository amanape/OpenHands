import { ClientActionFunctionArgs, json } from "@remix-run/react";
import { addFile, setImportedProjectZip } from "#/state/initial-query-slice";
import store from "#/store";
import { convertImageToBase64 } from "#/utils/convert-image-to-base-64";

const convertZipToBase64 = async (file: File) => {
  const reader = new FileReader();

  return new Promise<string>((resolve) => {
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const isMultipart = !!request.headers
    .get("Content-Type")
    ?.includes("multipart");

  if (isMultipart) {
    const formData = await request.formData();
    const file = formData.get("file");
    const importedProject = formData.get("imported-project");

    if (file instanceof File) {
      // TODO: Take care of this if SSR is enabled (store may not available on the server)
      store.dispatch(addFile(await convertImageToBase64(file)));
    }
    if (importedProject instanceof File) {
      store.dispatch(
        setImportedProjectZip(await convertZipToBase64(importedProject)),
      );
    }
  }

  return json(null);
};