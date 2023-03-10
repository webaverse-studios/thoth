import { IRunContextEditor } from '../../../types'

function install(editor: IRunContextEditor) {
  editor.on('componentregister', (component: any) => {
    component.worker = (node, inputs, outputs, context) => {
      if (context.socketOutput) {
        return context.socketOutput
      }
    }
  })
}

const defaultExport = {
  name: 'socketOverridePlugin',
  install,
}

export default defaultExport
