import { getInjectable } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { kubeObjectMenuItemInjectionToken } from "../../kube-object-menu/kube-object-menu-item-injection-token";
import { PodUploadMenu } from "../pod-upload-menu";

import type { KubeObjectMenuItemComponent } from "../../kube-object-menu/kube-object-menu-item-injection-token";

const PodUploadMenuInjectable = getInjectable({
  id: "pod-upload-menu-node-pod-menu",

  instantiate: () => ({
    kind: "Pod",
    apiVersions: ["v1"],
    Component: PodUploadMenu as KubeObjectMenuItemComponent,
    enabled: computed(() => true),
    orderNumber: 4,
  }),

  injectionToken: kubeObjectMenuItemInjectionToken,
});

export default PodUploadMenuInjectable;
