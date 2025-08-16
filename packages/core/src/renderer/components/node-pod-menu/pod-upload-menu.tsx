/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { Pod } from "@freelensapp/kube-object";
import { withInjectables } from "@ogre-tools/injectable-react";
import React from "react";
import type { Container, EphemeralContainer } from "@freelensapp/kube-object";
import PodMenuItem from "./pod-menu-item";
import showOpenDialogInjectable from "../open-dialog/show-open-dialog.injectable";
import requestToPodUploadInjectable from "../../../common/ipc/request-to-pod-upload.injectable";
import showInfoNotificationInjectable from "../notifications/show-info-notification.injectable";
import showErrorNotificationInjectable from "../notifications/show-error-notification.injectable";
import showInputDialogInjectable from "../input-dialog/show-input-dialog.injectable";

export interface PodUploadMenuProps {
  object: any;
  toolbar: boolean;
}

interface Dependencies {
  showOpenDialog: (options: { title: string; buttonLabel: string; properties: ("openFile" | "openDirectory")[] }) => Promise<string[] | undefined>;
  requestToPodUpload: (params: {
    pod: Pod;
    container: string;
    sourcePath: string;
    destinationPath: string;
  }) => Promise<void>;
  showInfoNotification: (message: string) => void;
  showErrorNotification: (message: string) => void;
  showInputDialog: (options: { title: string; message: string; placeholder: string }) => Promise<string | undefined>;
}

const NonInjectablePodUploadMenu: React.FC<PodUploadMenuProps & Dependencies> = ({
  object,
  toolbar,
  showOpenDialog,
  requestToPodUpload,
  showInfoNotification,
  showErrorNotification,
  showInputDialog,
}) => {
  if (!object) return null;
  const pod = new Pod(object);

  const containers = pod.getRunningContainersWithType();
  const statuses = pod.getContainerStatuses();

  const uploadToPod = async (container: Container | EphemeralContainer) => {
    const sourcePaths = await showOpenDialog({
      title: "Upload to Pod",
      buttonLabel: "Upload",
      properties: ["openFile", "openDirectory"],
    });

    if (!sourcePaths || sourcePaths.length === 0) {
      return;
    }

    const sourcePath = sourcePaths[0];

    const destinationPath = await showInputDialog({
      title: "Upload to Pod",
      message: `Enter the destination path in the container "${'container.name'}".`,
      placeholder: "/path/to/destination/folder",
    });

    if (!destinationPath) {
      return;
    }

    try {
      showInfoNotification(`Uploading to ${'pod.getName()'}:${'destinationPath'}...`);
      await requestToPodUpload({
        pod,
        container: container.name,
        sourcePath,
        destinationPath,
      });
      showInfoNotification(`Successfully uploaded to ${'pod.getName()'}:${'destinationPath'}`);
    } catch (error: any) {
      showErrorNotification(`Failed to upload: ${'error.message'}`);
    }
  };

  return (
    <PodMenuItem
      svg="upload"
      title="Upload to..."
      tooltip="Upload file/folder to Pod"
      toolbar={toolbar}
      containers={containers}
      statuses={statuses}
      onMenuItemClick={uploadToPod}
    />
  );
};

export const PodUploadMenu = withInjectables<Dependencies, PodUploadMenuProps>(
  NonInjectablePodUploadMenu,
  {
    getProps: (di, props) => ({
      ...props,
      showOpenDialog: di.inject(showOpenDialogInjectable),
      requestToPodUpload: di.inject(requestToPodUploadInjectable),
      showInfoNotification: di.inject(showInfoNotificationInjectable),
      showErrorNotification: di.inject(showErrorNotificationInjectable),
      showInputDialog: di.inject(showInputDialogInjectable),
    }),
  },
);
