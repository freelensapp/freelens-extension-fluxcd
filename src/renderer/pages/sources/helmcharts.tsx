import { Renderer } from "@freelensapp/extensions";

import { observer } from "mobx-react";

import React from "react";

import { KubeAge } from "../../components/ui/kube-age";
import { HelmChart, helmChartStore } from "../../k8s/fluxcd/sources/helmchart";
import { getStatusClass, getStatusMessage, getStatusText } from "../../utils";

const {
  Component: { KubeObjectListLayout, Badge },
} = Renderer;

enum sortBy {
  name = "name",
  namespace = "namespace",
  status = "status",
  ready = "ready",
  age = "age",
  chart = "chart",
}

@observer
export class FluxCDHelmCharts extends React.Component<{ extension: Renderer.LensExtension }> {
  render() {
    return (
      <KubeObjectListLayout
        tableId="helmRepositoriesTable"
        className="HelmCharts"
        store={helmChartStore}
        sortingCallbacks={{
          [sortBy.name]: (helmChart: HelmChart) => helmChart.getName(),
          [sortBy.namespace]: (helmChart: HelmChart) => helmChart.getNs(),
          [sortBy.ready]: (helmChart: HelmChart) => getStatusText(helmChart),
          [sortBy.chart]: (helmChart: HelmChart) => helmChart.spec.chart,
          [sortBy.status]: (helmChart: HelmChart) => getStatusMessage(helmChart),
          [sortBy.age]: (helmChart: HelmChart) => helmChart.getCreationTimestamp(),
        }}
        searchFilters={[(helmChart: HelmChart) => helmChart.getSearchFields()]}
        renderHeaderTitle="Helm Charts"
        renderTableHeader={[
          { title: "Name", className: "name", sortBy: sortBy.name },
          { title: "Namespace", className: "namespace", sortBy: sortBy.namespace },
          { title: "Ready", className: "ready", sortBy: sortBy.ready },
          { title: "Chart", className: "chart", sortBy: sortBy.chart },
          { title: "Status", className: "status", sortBy: sortBy.status },
          { title: "Age", className: "age", sortBy: sortBy.age },
        ]}
        renderTableContents={(helmChart: HelmChart) => [
          helmChart.getName(),
          helmChart.getNs(),
          this.renderStatus(helmChart),
          helmChart.spec.chart,
          getStatusMessage(helmChart),
          <KubeAge timestamp={helmChart.getCreationTimestamp()} key="age" />,
        ]}
      />
    );
  }

  renderStatus(helmChart: HelmChart) {
    const className = getStatusClass(helmChart);
    const text = getStatusText(helmChart);
    return <Badge key="name" label={text} className={className} />;
  }
}
