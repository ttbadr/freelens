import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { kubeObjectMenuItemInjectionToken } from "../../kube-object-menu/kube-object-menu-item-injection-token";
import { PodDownloadMenu } from "../pod-download-menu";

import type { KubeObjectMenuItemComponent } from "../../kube-object-menu/kube-object-menu-item-injection-token";

const PodDownloadMenuInjectable = getInjectable({
  id: "pod-download-menu-node-pod-menu",

  instantiate: () => ({
    kind: "Pod",
    apiVersions: ["v1"],
    Component: PodDownloadMenu as KubeObjectMenuItemComponent,
    enabled: computed(() => true),
    orderNumber: 3,
  }),

  injectionToken: kubeObjectMenuItemInjectionToken,
});

export default PodDownloadMenuInjectable;
