import { getInjectable } from "@ogre-tools/injectable";
import { remote } from "electron";

export type ShowSaveDialog = (options: {
  title: string;
  buttonLabel: string;
}) => Promise<string | undefined>;

const showSaveDialogInjectable = getInjectable({
  id: "show-save-dialog",

  instantiate: (): ShowSaveDialog => async (options) => {
    const { filePath } = await remote.dialog.showSaveDialog(options);

    return filePath;
  },
});

export default showSaveDialogInjectable;
