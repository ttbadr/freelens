/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { podDownloadChannel } from "../../common/ipc/pod-file-copy";
import createKubectlInjectable from "../kubectl/create-kubectl.injectable";
import { enlistRequestChannelListenerInjectionToken } from "@freelensapp/messaging-for-main";

const podDownloadChannelListenerInjectable = getInjectable({
  id: "pod-download-channel-listener",
  instantiate: (di) => {
    const createKubectl = di.inject(createKubectlInjectable);
    const enlistRequestChannelListener = di.inject(enlistRequestChannelListenerInjectionToken);

    return {
      channel: podDownloadChannel,
      handler: async (request) => {
        const kubectl = createKubectl(request.pod.getContext());

        await kubectl.copyFromPod(
          request.pod.getNs(),
          request.pod.getName(),
          request.container,
          request.sourcePath,
          request.destinationPath,
        );
      },
    };
  },
  injectionToken: enlistRequestChannelListenerInjectionToken,
});

export default podDownloadChannelListenerInjectable;