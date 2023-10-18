import { Renderer } from '@k8slens/extensions'

const { KubeApi } = Renderer.K8sApi;

const KubeObject = Renderer.K8sApi.KubeObject;
const KubeObjectStore = Renderer.K8sApi.KubeObjectStore;

export class Provider extends KubeObject {
  static readonly kind = "Provider";
  static readonly namespaced = true;
  static readonly apiBase = "/apis/notification.toolkit.fluxcd.io/v1beta2/providers";
}

export class ProviderApi extends KubeApi<Provider> {
}
export const providerApi = new ProviderApi({ objectConstructor: Provider });
export class ProviderStore extends KubeObjectStore<Provider> {
  api: Renderer.K8sApi.KubeApi<Provider> = providerApi;
}
export const providerStore = new ProviderStore();

Renderer.K8sApi.apiManager.registerStore(providerStore);

