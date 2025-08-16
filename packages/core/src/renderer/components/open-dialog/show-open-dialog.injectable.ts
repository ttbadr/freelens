import { getInjectable } from "@ogre-tools/injectable";
import { remote } from "electron";

export type ShowOpenDialog = (options: {
  title: string;
  buttonLabel: string;
  properties: ("openFile" | "openDirectory")[]
}) => Promise<string[] | undefined>;

const showOpenDialogInjectable = getInjectable({
  id: "show-open-dialog",

  instantiate: (): ShowOpenDialog => async (options) => {
    const { filePaths } = await remote.dialog.showOpenDialog(options);

    return filePaths;
  },
});

export default showOpenDialogInjectable;
