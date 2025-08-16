/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { podUploadChannel } from "../../common/ipc/pod-file-copy";
import createKubectlInjectable from "../kubectl/create-kubectl.injectable";
import { enlistRequestChannelListenerInjectionToken } from "@freelensapp/messaging-for-main";

const podUploadChannelListenerInjectable = getInjectable({
  id: "pod-upload-channel-listener",
  instantiate: (di) => {
    const createKubectl = di.inject(createKubectlInjectable);
    const enlistRequestChannelListener = di.inject(enlistRequestChannelListenerInjectionToken);

    return {
      channel: podUploadChannel,
      handler: async (request) => {
        const kubectl = createKubectl(request.pod.getContext());

        await kubectl.copyToPod(
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

export default podUploadChannelListenerInjectable;
