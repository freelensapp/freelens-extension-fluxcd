import { Renderer } from '@k8slens/extensions'

import { observer } from 'mobx-react'

import React from 'react'

import { helmReleaseStore, HelmRelease } from '../../k8s/fluxcd/helm/helmrelease'
import { getStatusClass, getStatusMessage, getStatusText } from '../../utils'
import { KubeAge } from '../../components/ui/kube-age'

const {
  Component: { KubeObjectListLayout, Badge },
} = Renderer

enum sortBy {
  name = 'name',
  namespace = 'namespace',
  status = 'status',
  ready = 'ready',
  age = 'age',
  chartVersion = 'chartVersion',
}

@observer
export class FluxCDHelmReleases extends React.Component<{ extension: Renderer.LensExtension }> {
  render() {
    return (
      <KubeObjectListLayout
        tableId="helmReleasesTable"
        className="HelmReleases"
        store={helmReleaseStore}
        sortingCallbacks={{
          // show revision like weave
          [sortBy.name]: (helmRelease: HelmRelease) => helmRelease.getName(),
          [sortBy.namespace]: (helmRelease: HelmRelease) => helmRelease.getNs(),
          [sortBy.ready]: (helmRelease: HelmRelease) => getStatusText(helmRelease),
          [sortBy.chartVersion]: (helmRelease: HelmRelease) => helmRelease.spec.chart.spec.version,
          [sortBy.status]: (helmRelease: HelmRelease) => getStatusMessage(helmRelease),
          [sortBy.age]: (helmRelease: HelmRelease) => helmRelease.getCreationTimestamp(),
        }}
        searchFilters={[(helmRelease: HelmRelease) => helmRelease.getSearchFields()]}
        renderHeaderTitle="Helm Releases"
        renderTableHeader={[
          { title: 'Name', className: 'name', sortBy: sortBy.name },
          { title: 'Namespace', className: 'namespace', sortBy: sortBy.namespace },
          { title: 'Ready', className: 'ready', sortBy: sortBy.ready },
          { title: 'Version', className: 'version', sortBy: sortBy.chartVersion },
          { title: 'Status', className: 'status', sortBy: sortBy.status },
          { title: 'Age', className: 'age', sortBy: sortBy.age },
        ]}
        renderTableContents={(helmRelease: HelmRelease) => [
          helmRelease.getName(),
          helmRelease.getNs(),
          this.renderStatus(helmRelease),
          helmRelease.spec.chart.spec.version,
          getStatusMessage(helmRelease),
          <KubeAge timestamp={helmRelease.getCreationTimestamp()} key="age" />,
        ]}
      />
    )
  }

  renderStatus(helmRelease: HelmRelease) {
    const className = getStatusClass(helmRelease)
    const text = getStatusText(helmRelease)
    return <Badge key="name" label={text} className={className} />
  }
}
