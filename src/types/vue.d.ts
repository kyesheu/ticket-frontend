import '@vue/runtime-core'

export {}

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    proxy: any
  }

  interface ComponentCustomProperties {
    $tab: any
    $auth: any
    $cache: any
    $modal: {
      msgSuccess: (msg: string) => void
      msgWarning: (msg: string) => void
      msgError: (msg: string) => void
      confirm: (msg: string) => Promise<void>
      loading: (text: string) => any
      closeLoading: () => void
    }
    $download: any
    useDict: any
    download: any
    parseTime: any
    resetForm: (refName: string) => void
    handleTree: any
    addDateRange: (params: Record<string, any>, dateRange: string[]) => any
    getConfigKey: (key: string) => Promise<any>
    selectDictLabel: any
    selectDictLabels: any
  }
}
