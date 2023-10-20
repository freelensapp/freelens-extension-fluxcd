import { Renderer } from '@k8slens/extensions'

import { observer } from 'mobx-react'

import React from 'react'

import {
  imageUpdateAutomationStore,
  ImageUpdateAutomation,
} from '../../k8s/fluxcd/image-automation/imageupdateautomation'
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
}

@observer
export class FluxCDImageUpdateAutomations extends React.Component<{ extension: Renderer.LensExtension }> {
  render() {
    return (
      <KubeObjectListLayout
        tableId="imageUpdateAutomationsTable"
        className="ImageUpdateAutomations"
        store={imageUpdateAutomationStore}
        sortingCallbacks={{
          [sortBy.name]: (imageUpdateAutomation: ImageUpdateAutomation) => imageUpdateAutomation.getName(),
          [sortBy.namespace]: (imageUpdateAutomation: ImageUpdateAutomation) => imageUpdateAutomation.getNs(),
          [sortBy.ready]: (imageUpdateAutomation: ImageUpdateAutomation) => getStatusText(imageUpdateAutomation),
          [sortBy.status]: (imageUpdateAutomation: ImageUpdateAutomation) => getStatusMessage(imageUpdateAutomation),
          [sortBy.age]: (imageUpdateAutomation: ImageUpdateAutomation) => imageUpdateAutomation.getCreationTimestamp(),
        }}
        searchFilters={[(imageUpdateAutomation: ImageUpdateAutomation) => imageUpdateAutomation.getSearchFields()]}
        renderHeaderTitle="Image Update Automations"
        renderTableHeader={[
          { title: 'Name', className: 'name', sortBy: sortBy.name },
          { title: 'Namespace', className: 'namespace', sortBy: sortBy.namespace },
          { title: 'Ready', className: 'ready', sortBy: sortBy.ready },
          { title: 'Status', className: 'status', sortBy: sortBy.status },
          { title: 'Age', className: 'age', sortBy: sortBy.age },
        ]}
        renderTableContents={(imageUpdateAutomation: ImageUpdateAutomation) => [
          imageUpdateAutomation.getName(),
          imageUpdateAutomation.getNs(),
          this.renderStatus(imageUpdateAutomation),
          getStatusMessage(imageUpdateAutomation),
          <KubeAge timestamp={imageUpdateAutomation.getCreationTimestamp()} key="age" />,
        ]}
      />
    )
  }

  renderStatus(imageUpdateAutomation: ImageUpdateAutomation) {
    const className = getStatusClass(imageUpdateAutomation)
    const text = getStatusText(imageUpdateAutomation)
    return <Badge key="name" label={text} className={className} />
  }
}
