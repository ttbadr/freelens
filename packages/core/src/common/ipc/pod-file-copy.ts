/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { Pod } from "@freelensapp/kube-object";
import type { RequestChannel } from "../../features/messaging/requesting-of-requests/request-from-channel.injectable";

export interface PodDownloadRequest {
  pod: Pod;
  container: string;
  sourcePath: string;
  destinationPath: string;
}

export const podDownloadChannel: RequestChannel<PodDownloadRequest, void> = {
  id: "pod-download-channel",
};

export interface PodUploadRequest {
  pod: Pod;
  container: string;
  sourcePath: string;
  destinationPath: string;
}

export const podUploadChannel: RequestChannel<PodUploadRequest, void> = {
  id: "pod-upload-channel",
};
