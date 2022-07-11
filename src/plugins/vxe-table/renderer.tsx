import vxeTable from 'vxe-table'

type VXETable = typeof vxeTable

export default function tableRenderer(renderer: VXETable['renderer']) {
  renderer.add('buttons', {
    // 默认显示模板
    renderDefault(renderOpts, params) {
      const { props } = renderOpts
      const buttons: TableButton[] =
        (typeof props?.buttons === 'function' ? props?.buttons(params) : props?.buttons) || []
      return buttons
        .filter((v) => v.visible !== false)
        .map((v) => {
          return (
            <span>
              <vxe-button
                class={v?.className}
                status={v.disabled ? '' : v.status || 'primary'}
                type="text"
                onClick={() => v.event(params as any)}
                disabled={v.disabled}
              >
                {v.name}
              </vxe-button>
            </span>
          )
        })
    },
  })
}
