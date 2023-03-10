import { Layout } from '@/workspaces/contexts/LayoutProvider'
import EventHandler from '@/screens/Thoth/components/EventHandler'
import StateManager from '@/workspaces/spells/windows/StateManagerWindow'
import EntityManagerWindow from './windows/EntityManagerWindow'
import SearchCorpus from './windows/SearchCorpusWindow'

const Workspace = ({ tab, pubSub }) => {
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
        case 'searchCorpus':
          return <SearchCorpus />
        case 'entityManager':
          return <EntityManagerWindow />
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
