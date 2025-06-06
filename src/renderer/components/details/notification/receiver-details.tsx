import { Renderer } from "@freelensapp/extensions";
import React from "react";
import { crdStore } from "../../../k8s/core/crd";
import { Receiver } from "../../../k8s/fluxcd/notifications/receiver";
import { getStatusClass, getStatusText, lowerAndPluralize } from "../../../utils";

interface ReceiverDetailsState {
  events: Renderer.K8sApi.KubeEvent[];
  crds: Renderer.K8sApi.CustomResourceDefinition[];
}

const {
  Component: { DrawerItem, Badge },
} = Renderer;

export class FluxCDReceiverDetails extends React.Component<
  Renderer.Component.KubeObjectDetailsProps<Receiver>,
  ReceiverDetailsState
> {
  public readonly state: Readonly<ReceiverDetailsState> = {
    events: [],
    crds: [],
  };

  getCrd(kind: string): Renderer.K8sApi.CustomResourceDefinition | undefined {
    const { crds } = this.state;

    if (!kind) {
      return;
    }

    if (!crds) {
      return;
    }

    return crds.find((crd) => crd.spec.names.kind === kind);
  }

  sourceUrl(resource: any) {
    const name = resource.name;
    const ns = resource.namespace ?? this.props.object.metadata.namespace;
    const kind = lowerAndPluralize(resource.kind);
    const crd = this.getCrd(resource.kind);
    const apiVersion = crd?.spec.versions?.find((v: any) => v.storage === true)?.name;
    const group = crd?.spec.group;

    if (!apiVersion || !group) return "";

    return `/apis/${group}/${apiVersion}/namespaces/${ns}/${kind}/${name}`;
  }

  async componentDidMount() {
    crdStore.loadAll().then((l: any) => this.setState({ crds: l as Renderer.K8sApi.CustomResourceDefinition[] }));
  }

  render() {
    const { object } = this.props;

    return (
      <div>
        <DrawerItem name="Status">{object.status?.conditions?.find((s: any) => s.type === "Ready").message}</DrawerItem>
        <DrawerItem name="Ready">
          <Badge className={getStatusClass(object)} label={getStatusText(object)} />
        </DrawerItem>
        <DrawerItem name="Interval">{object.spec.interval}</DrawerItem>
        <DrawerItem name="Suspended">{object.spec.suspend === true ? "Yes" : "No"}</DrawerItem>
        <DrawerItem name="Webhook Path">
          <a href="#">{object.status?.webhookPath}</a>
        </DrawerItem>
        <DrawerItem name="Events">
          {object.spec.events.map((e: string, index: number) => (
            <li key={index}>
              <Badge label={e} />
            </li>
          ))}
        </DrawerItem>
        <DrawerItem name="Resources">
          {object.spec.resources.map((resource, index: number) => (
            <li key={index}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  Renderer.Navigation.showDetails(this.sourceUrl(resource), true);
                }}
              >
                {resource.kind}:{resource.name}
              </a>
            </li>
          ))}
        </DrawerItem>
      </div>
    );
  }
}
