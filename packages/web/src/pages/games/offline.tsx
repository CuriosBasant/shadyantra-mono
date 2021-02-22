import { GetServerSideProps } from 'next'
import { database } from '../../firebase'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { BoardContainer, Page } from '../../components'

export default function OfflineBoard() {

  return (
    <BoardContainer />
    // <Page title='Offline Shadyantra'> </Page>
  )
}

