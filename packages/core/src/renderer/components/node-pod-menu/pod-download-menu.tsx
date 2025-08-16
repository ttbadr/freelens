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
import showSaveDialogInjectable from "../save-dialog/show-save-dialog.injectable";
import requestFromPodDownloadInjectable from "../../../common/ipc/request-from-pod-download.injectable";
import showInfoNotificationInjectable from "../notifications/show-info-notification.injectable";
import showErrorNotificationInjectable from "../notifications/show-error-notification.injectable";
import showInputDialogInjectable from "../input-dialog/show-input-dialog.injectable";

export interface PodDownloadMenuProps {
  object: any;
  toolbar: boolean;
}

interface Dependencies {
  showSaveDialog: (options: { title: string; buttonLabel: string }) => Promise<string | undefined>;
  requestFromPodDownload: (params: {
    pod: Pod;
    container: string;
    sourcePath: string;
    destinationPath: string;
  }) => Promise<void>;
  showInfoNotification: (message: string) => void;
  showErrorNotification: (message: string) => void;
  showInputDialog: (options: { title: string; message: string; placeholder: string }) => Promise<string | undefined>;
}

const NonInjectablePodDownloadMenu: React.FC<PodDownloadMenuProps & Dependencies> = ({
  object,
  toolbar,
  showSaveDialog,
  requestFromPodDownload,
  showInfoNotification,
  showErrorNotification,
  showInputDialog,
}) => {
  if (!object) return null;
  const pod = new Pod(object);

  const containers = pod.getRunningContainersWithType();
  const statuses = pod.getContainerStatuses();

  const downloadFromPod = async (container: Container | EphemeralContainer) => {
    const sourcePath = await showInputDialog({
      title: "Download from Pod",
      message: `Enter the source path in the container "${'container.name'}" to download from.`,
      placeholder: "/path/to/file/or/folder",
    });

    if (!sourcePath) {
      return;
    }

    const destinationPath = await showSaveDialog({
      title: "Download from Pod",
      buttonLabel: "Save",
    });

    if (!destinationPath) {
      return;
    }

    try {
      showInfoNotification(`Downloading from ${'pod.getName()'}:${'sourcePath'}...`);
      await requestFromPodDownload({
        pod,
        container: container.name,
        sourcePath,
        destinationPath,
      });
      showInfoNotification(`Successfully downloaded from ${'pod.getName()'}:${'sourcePath'} to ${'destinationPath'}`);
    } catch (error: any) {
      showErrorNotification(`Failed to download: ${'error.message'}`);
    }
  };

  return (
    <PodMenuItem
      svg="download"
      title="Download from..."
      tooltip="Download file/folder from Pod"
      toolbar={toolbar}
      containers={containers}
      statuses={statuses}
      onMenuItemClick={downloadFromPod}
    />
  );
};

export const PodDownloadMenu = withInjectables<Dependencies, PodDownloadMenuProps>(
  NonInjectablePodDownloadMenu,
  {
    getProps: (di, props) => ({
      ...props,
      showSaveDialog: di.inject(showSaveDialogInjectable),
      requestFromPodDownload: di.inject(requestFromPodDownloadInjectable),
      showInfoNotification: di.inject(showInfoNotificationInjectable),
      showErrorNotification: di.inject(showErrorNotificationInjectable),
      showInputDialog: di.inject(showInputDialogInjectable),
    }),
  },
);
