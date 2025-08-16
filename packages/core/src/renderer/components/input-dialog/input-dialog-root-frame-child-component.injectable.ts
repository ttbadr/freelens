/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { rootFrameChildComponentInjectionToken } from "@freelensapp/react-application";
import { InputDialog } from "./input-dialog";

const inputDialogRootFrameChildComponentInjectable = getInjectable({
  id: "input-dialog-root-frame-child-component",

  instantiate: () => ({
    id: "input-dialog",
    shouldRender: true,
    Component: InputDialog,
  }),

  injectionToken: rootFrameChildComponentInjectionToken,
});

export default inputDialogRootFrameChildComponentInjectable;
