/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import inputDialogStateInjectable from "./state.injectable";
import type { InputDialogParams } from "./input-dialog";

export type OpenInputDialog = (params: InputDialogParams) => void;

const openInputDialogInjectable = getInjectable({
  id: "open-input-dialog",
  instantiate: (di): OpenInputDialog => {
    const state = di.inject(inputDialogStateInjectable);

    return (params) => state.set(params);
  },
});

export default openInputDialogInjectable;
