import { useState } from 'react'

type SectionState = { status: string; error?: boolean }

export function App(): React.JSX.Element {
  const [counterStatus, setCounterStatus] = useState<SectionState>({ status: '' })
  const [echoStatus, setEchoStatus] = useState<SectionState>({ status: '' })
  const [utilStatus, setUtilStatus] = useState<SectionState>({ status: '' })

  const setStatus = (
    setter: React.Dispatch<React.SetStateAction<SectionState>>,
    msg: string,
    error = false
  ) => setter({ status: msg, error })

  return (
    <>
      <h1 className="sink-title">Kitchen Sink</h1>

      <section className="section">
        <h2>Counter (IpcHandle, IpcOn, CorrelationId, Sender, Window, ProcessId)</h2>
        <div className="section-actions">
          <button
            onClick={async () => {
              try {
                const n = await window.ipc.counter.get()
                setStatus(setCounterStatus, `get → ${n}`)
              } catch (e) {
                setStatus(setCounterStatus, String(e), true)
              }
            }}
          >
            get
          </button>
          <button
            onClick={async () => {
              try {
                const n = await window.ipc.counter.inc(2)
                setStatus(setCounterStatus, `inc(2) → ${n}`)
              } catch (e) {
                setStatus(setCounterStatus, String(e), true)
              }
            }}
          >
            inc(2)
          </button>
          <button
            onClick={async () => {
              try {
                const pong = await window.ipc.counter.ping()
                setStatus(setCounterStatus, `ping → ${pong}`)
              } catch (e) {
                setStatus(setCounterStatus, String(e), true)
              }
            }}
          >
            ping
          </button>
          <button
            className="secondary"
            onClick={() => {
              window.ipc.counter.reset()
              setStatus(setCounterStatus, 'reset() called')
            }}
          >
            reset
          </button>
        </div>
        <div className={`status ${counterStatus.error ? 'error' : ''}`}>{counterStatus.status || '—'}</div>
      </section>

      <section className="section">
        <h2>Echo (IpcHandle, IpcHandleOnce, IpcOn, IpcOnce — complex/simple types)</h2>
        <div className="section-actions">
          <button
            onClick={async () => {
              try {
                const input = {
                  id: 'x',
                  count: 1,
                  nested: { flag: true, kind: 'a' as const },
                  tags: ['a', 'b'],
                  union: 42
                }
                const out = await window.ipc.echo.complex(input)
                setStatus(setEchoStatus, JSON.stringify(out, null, 2))
              } catch (e) {
                setStatus(setEchoStatus, String(e), true)
              }
            }}
          >
            complex
          </button>
          <button
            onClick={async () => {
              try {
                const out = await window.ipc.echo.simple({ message: 'hello' })
                setStatus(setEchoStatus, JSON.stringify(out))
              } catch (e) {
                setStatus(setEchoStatus, String(e), true)
              }
            }}
          >
            simple
          </button>
          <button
            onClick={async () => {
              try {
                const out = await window.ipc.echo.onceInvoke('test')
                setStatus(setEchoStatus, out)
              } catch (e) {
                setStatus(setEchoStatus, String(e), true)
              }
            }}
          >
            onceInvoke
          </button>
          <button
            className="secondary"
            onClick={() => {
              window.ipc.echo.fireAndForget('fire')
              setStatus(setEchoStatus, 'fireAndForget sent')
            }}
          >
            fireAndForget
          </button>
          <button
            className="secondary"
            onClick={() => {
              window.ipc.echo.onceListen()
              setStatus(setEchoStatus, 'onceListen sent')
            }}
          >
            onceListen
          </button>
        </div>
        <div className={`status pre ${echoStatus.error ? 'error' : ''}`}>
          {echoStatus.status || '—'}
        </div>
      </section>

      <section className="section">
        <h2>Util (Origin, RawEvent)</h2>
        <div className="section-actions">
          <button
            onClick={async () => {
              try {
                const out = await window.ipc.util.withOrigin()
                setStatus(setUtilStatus, JSON.stringify(out))
              } catch (e) {
                setStatus(setUtilStatus, String(e), true)
              }
            }}
          >
            withOrigin
          </button>
          <button
            onClick={async () => {
              try {
                const out = await window.ipc.util.withRawEvent()
                setStatus(setUtilStatus, JSON.stringify(out))
              } catch (e) {
                setStatus(setUtilStatus, String(e), true)
              }
            }}
          >
            withRawEvent
          </button>
        </div>
        <div className={`status ${utilStatus.error ? 'error' : ''}`}>{utilStatus.status || '—'}</div>
      </section>
    </>
  )
}

export default App
