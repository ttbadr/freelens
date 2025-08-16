/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { podDownloadChannel } from "./pod-file-copy";
import requestFromChannelInjectable from "../../features/messaging/requesting-of-requests/request-from-channel.injectable";

const requestFromPodDownloadInjectable = getInjectable({
  id: "request-from-pod-download",
  instantiate: (di) => {
    const requestFromChannel = di.inject(requestFromChannelInjectable);

    return (params: { pod: any; container: string; sourcePath: string; destinationPath: string; }) => requestFromChannel(podDownloadChannel, params);
  },
});

export default requestFromPodDownloadInjectable;
