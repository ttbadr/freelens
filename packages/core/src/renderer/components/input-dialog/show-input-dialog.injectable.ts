/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import openInputDialogInjectable from "./open.injectable";
import type { InputDialogBooleanParams } from "./input-dialog";

export type ShowInputDialog = (params: InputDialogBooleanParams) => Promise<string | undefined>;

const showInputDialogInjectable = getInjectable({
  id: "show-input-dialog",
  instantiate: (di): ShowInputDialog => {
    const open = di.inject(openInputDialogInjectable);

    return (params) =>
      new Promise((resolve) => {
        open({
          onSuccess: (value) => resolve(value),
          onCancel: () => resolve(undefined),
          ...params,
        });
      });
  },
});

export default showInputDialogInjectable;
