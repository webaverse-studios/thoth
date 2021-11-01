import { useEffect } from 'react'

import { store } from '@/state/store'
import { useEditor } from '@thoth/contexts/EditorProvider'
import { Layout } from '@thoth/contexts/LayoutProvider'
import { useModule } from '@/contexts/ModuleProvider'
import {
  useLazyGetSpellQuery,
  useSaveSpellMutation,
  selectSpellById,
} from '@/state/api/spells'
import { debounce } from '@/utils/debounce'
import EditorWindow from '@thoth/windows/EditorWindow'
import EventHandler from '@thoth/components/EventHandler'
import Inspector from '@thoth/windows/InspectorWindow'
import Playtest from '@thoth/windows/PlaytestWindow'
import StateManager from '@thoth/windows/StateManagerWindow'
import TextEditor from '@thoth/windows/TextEditorWindow'

const Workspace = ({ tab, tabs, pubSub }) => {
  const [loadSpell, { data: spellData }] = useLazyGetSpellQuery()
  const [saveSpell] = useSaveSpellMutation()
  const { saveModule } = useModule()
  const { editor } = useEditor()

  // Set up autosave for the workspaces
  useEffect(() => {
    if (!editor?.on) return
    return editor.on(
      'save nodecreated noderemoved connectioncreated connectionremoved nodetranslated',
      debounce(() => {
        if (tab.type === 'spell') {
          saveSpell({ ...spellData, chain: editor.toJSON() })
        }
        if (tab.type === 'module') {
          saveModule(tab.module, { data: editor.toJSON() }, false)
          // when a module is saved, we look for any open spell tabs, and check if they have the module.
          /// if they do, we trigger a save to ensure the module change is captured to the server
          tabs
            .filter(tab => tab.type === 'spell')
            .forEach(filteredTab => {
              if (filteredTab.spell) {
                const spell = selectSpellById(
                  store.getState(),
                  filteredTab.spell
                )
                if (spell?.modules.some(module => module.name === tab.module))
                  saveSpell({ ...spell })
              }
            })
        }
      }, 500)
    )
  }, [editor])

  useEffect(() => {
    if (!tab || !tab.spell) return
    loadSpell(tab.spell)
  }, [tab])

  const factory = tab => {
    return node => {
      const props = {
        tab,
        node,
      }
      const component = node.getComponent()
      switch (component) {
        case 'stateManager':
          return <StateManager {...props} />
        case 'playtest':
          return <Playtest {...props} />
        case 'inspector':
          return <Inspector {...props} />
        case 'textEditor':
          return <TextEditor {...props} />
        case 'editorWindow':
          return <EditorWindow {...props} />
        default:
          return <p></p>
      }
    }
  }

  return (
    <>
      <EventHandler tab={tab} pubSub={pubSub} />
      <Layout json={tab.layoutJson} factory={factory(tab)} tab={tab} />
    </>
  )
}

const Wrapped = props => {
  return <Workspace {...props} />
}

export default Wrapped